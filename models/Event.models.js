const { Schema, model } = require("mongoose");
const Artist = require("./Artist.model");

const eventSchema = new Schema({
  eventName: {
    type: String,
    required: true,
  },
  location: String,
  date: {
    type: Date,
    required: true,
  },

  artworkUrl: String,
  lineUp: [
    {
      type: Schema.Types.ObjectId,
      ref: Artist,
    },
  ],
  ticketPrice: Number,
});

const Event = model("Event", eventSchema);

module.exports = Event;
