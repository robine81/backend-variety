const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Artist = sequelize.define("Artist", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  artistPicUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  soundCloudUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  beatPortUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instagramUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  facebookUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  webPage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "artists",
  timestamps: false, // set to true if you want createdAt/updatedAt
});

module.exports = Artist;