const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    eventName : {
        type: String,
        required: true,
    },
    location: String,
    date: {
        type: Date,
        required: true,
    },
    time: Number,
    artworkUrl: String,
    lineUp: [String],
    ticketPrice: Number,
  }
);

const Event = model("Event", eventSchema);

module.exports = Event;