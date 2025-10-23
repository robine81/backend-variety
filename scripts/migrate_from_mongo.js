/*
  scripts/migrate_from_mongo.js

  Usage:
    node scripts/migrate_from_mongo.js [path_to_export_folder]

  Expects files in the export folder:
    - users.json
    - artists.json
    - events.json

  The script will:
    - load JSON arrays from those files
    - map Mongo _id values to newly created Sequelize ids
    - create Users, Artists, Events and associate Event<->Artist via the many-to-many

  NOTE: Run this against a development database only. It does not dedupe existing records.
*/

const path = require('path');
const fs = require('fs').promises;
const sequelize = require('../config/database');
const User = require('../models/User.model.new');
const Artist = require('../models/Artist.model.new');
const Event = require('../models/Event.model.new');

async function loadJson(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

async function main() {
  const folder = process.argv[2] || path.join(process.cwd(), 'mongo_exports');
  console.log('Using export folder:', folder);

  // check files exist
  const usersPath = path.join(folder, 'users.json');
  const artistsPath = path.join(folder, 'artists.json');
  const eventsPath = path.join(folder, 'events.json');

  try {
    await fs.access(usersPath);
    await fs.access(artistsPath);
    await fs.access(eventsPath);
  } catch (err) {
    console.error('Missing expected export files in', folder);
    console.error('Expected users.json, artists.json, events.json');
    process.exit(1);
  }

  await sequelize.authenticate();
  console.log('DB connected');

  // load data
  const users = await loadJson(usersPath);
  const artists = await loadJson(artistsPath);
  const events = await loadJson(eventsPath);

  // maps from mongo _id (string) to Sequelize id
  const userIdMap = new Map();
  const artistIdMap = new Map();
  const eventIdMap = new Map();

  // Import users
  console.log(`Importing ${users.length} users...`);
  for (const u of users) {
    // adjust fields as necessary (assume { _id, email, password, firstName, lastName })
    const payload = {
      email: u.email,
      password: u.password,
      firstName: u.firstName || null,
      lastName: u.lastName || null,
    };
    const created = await User.create(payload);
    userIdMap.set(String(u._id), created.id);
  }

  // Import artists
  console.log(`Importing ${artists.length} artists...`);
  for (const a of artists) {
    const payload = {
      firstName: a.firstName || null,
      lastName: a.lastName || null,
      artistName: a.artistName || null,
      artistPicUrl: a.artistPicUrl || null,
      soundCloudUrl: a.soundCloudUrl || null,
      beatPortUrl: a.beatPortUrl || null,
      instagramUrl: a.instagramUrl || null,
      facebookUrl: a.facebookUrl || null,
      webPage: a.webPage || null,
    };
    const created = await Artist.create(payload);
    artistIdMap.set(String(a._id), created.id);
  }

  // Import events and associate artists
  console.log(`Importing ${events.length} events...`);
  for (const e of events) {
    const payload = {
      eventName: e.eventName,
      location: e.location || null,
      date: e.date ? new Date(e.date) : null,
      artworkUrl: e.artworkUrl || null,
      ticketPrice: e.ticketPrice || null,
    };
    const createdEvent = await Event.create(payload);
    eventIdMap.set(String(e._id), createdEvent.id);

    // Associate artists if lineUp contains ObjectId strings
    if (Array.isArray(e.lineUp) && e.lineUp.length > 0) {
      const mappedArtistIds = e.lineUp
        .map((aid) => artistIdMap.get(String(aid)))
        .filter(Boolean);
      if (mappedArtistIds.length > 0) {
        const artistsToAdd = await Artist.findAll({ where: { id: mappedArtistIds } });
        await createdEvent.addArtists(artistsToAdd);
      }
    }
  }

  console.log('Migration complete');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
