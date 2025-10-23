const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); 
// Use the Sequelize-based Artist model
const Artist = require("./Artist.model.new");

const Event = sequelize.define("Event", {
  eventName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  artworkUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ticketPrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  tableName: "events",
  timestamps: false, // disable if not needed
});

// Many-to-many relationship (Event <-> Artist)
Event.belongsToMany(Artist, { through: "EventArtists", foreignKey: "eventId" });
Artist.belongsToMany(Event, { through: "EventArtists", foreignKey: "artistId" });

module.exports = Event;
