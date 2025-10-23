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

function normalizeId(raw) {
  // raw may be: a string '6470...', or an object { "$oid": '...' }, or an object with $oid nested
  if (!raw && raw !== 0) return undefined;
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'object') {
    if (raw.$oid) return raw.$oid;
    if (raw.$id && typeof raw.$id === 'object' && raw.$id.$oid) return raw.$id.$oid;
    // sometimes exported as { "_id": { "$oid": "..." } }
    if (raw._id && raw._id.$oid) return raw._id.$oid;
    // fallback: try JSON string
    try {
      return JSON.stringify(raw);
    } catch (e) {
      return String(raw);
    }
  }
  return String(raw);
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry') || args.includes('--dry-run');
  const folderArg = args.find((a) => !a.startsWith('--'));
  const folder = folderArg || path.join(process.cwd(), 'mongo_exports');
  console.log('Using export folder:', folder, dry ? '(dry-run mode)' : '');

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

  if (!dry) {
    await sequelize.authenticate();
    console.log('DB connected');
  } else {
    console.log('Dry run: skipping DB connection and writes');
  }

  // load data
  const users = await loadJson(usersPath);
  const artists = await loadJson(artistsPath);
  const events = await loadJson(eventsPath);

  // Validate that the loaded files are arrays of documents (mongoexport --jsonArray produces this)
  function expectArray(name, value) {
    if (!Array.isArray(value)) {
      console.error(`Expected ${name} to be a JSON array of documents but got ${typeof value}`);
      console.error(`If you exported from MongoDB, please use mongoexport with --jsonArray. Example:`);
      console.error(`  mongoexport --uri="$MONGO_URI" --collection=${name} --out=mongo_exports/${name}.json --jsonArray`);
      console.error('Alternatively, place a JSON array file at the expected path.');
      process.exit(1);
    }
  }

  expectArray('users', users);
  expectArray('artists', artists);
  expectArray('events', events);

  // maps from mongo _id (string) to Sequelize id
  const userIdMap = new Map();
  const artistIdMap = new Map();
  const eventIdMap = new Map();

  // Import users
  console.log(`Found ${users.length} users`);
  if (dry) {
    console.log('Sample users (first 5):', users.slice(0, 5).map((u) => ({ _id: normalizeId(u._id), email: u.email })));
    // simulate mapping with placeholder ids
    users.slice(0, 100).forEach((u, idx) => userIdMap.set(normalizeId(u._id), `dry-user-${idx + 1}`));
  } else {
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
      userIdMap.set(normalizeId(u._id), created.id);
    }
  }

  // Import artists
  console.log(`Found ${artists.length} artists`);
  if (dry) {
    console.log('Sample artists (first 5):', artists.slice(0, 5).map((a) => ({ _id: normalizeId(a._id), artistName: a.artistName })));
    artists.slice(0, 200).forEach((a, idx) => artistIdMap.set(normalizeId(a._id), `dry-artist-${idx + 1}`));
  } else {
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
      artistIdMap.set(normalizeId(a._id), created.id);
    }
  }

  // Import events and associate artists
  console.log(`Found ${events.length} events`);
  if (dry) {
    console.log('Sample events (first 5):', events.slice(0, 5).map((e) => ({ _id: normalizeId(e._id), eventName: e.eventName, artistCount: (e.lineUp||[]).length })));
    events.slice(0, 200).forEach((e, idx) => eventIdMap.set(normalizeId(e._id), `dry-event-${idx + 1}`));
    // show sample associations for first 10 events
    for (const e of events.slice(0, 10)) {
      const mappedArtistIds = (e.lineUp || []).map((aid) => artistIdMap.get(normalizeId(aid))).filter(Boolean);
      console.log(`Event ${normalizeId(e._id)} -> artists:`, mappedArtistIds.slice(0, 10));
    }
  } else {
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
      eventIdMap.set(normalizeId(e._id), createdEvent.id);

      // Associate artists if lineUp contains ObjectId strings
      if (Array.isArray(e.lineUp) && e.lineUp.length > 0) {
        const mappedArtistIds = e.lineUp
          .map((aid) => artistIdMap.get(normalizeId(aid)))
          .filter(Boolean);
        if (mappedArtistIds.length > 0) {
          const artistsToAdd = await Artist.findAll({ where: { id: mappedArtistIds } });
          await createdEvent.addArtists(artistsToAdd);
        }
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
