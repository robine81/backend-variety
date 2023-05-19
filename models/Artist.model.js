const { Schema, model } = require("mongoose");

const artistSchema = new Schema(
  {
    password: {
      type: String,
      required: true,
      },
    email: {
      type: String,
      required: true,
      unique: true,
      },
    firstName: String,
    lastName: String,
    artistName: String,
    artistPicUrl: String,
    soundCloudUrl: String,
    beatPortUrl: String,
    instagramUrl: String,
    facebookUrl: String,
    webPage: String,
  }
);

const Artist = model("Artist", artistSchema);

module.exports = Artist;
