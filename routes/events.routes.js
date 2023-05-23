const router = require("express").Router();
const { Types } = require("mongoose");
const EventModel = require("../models/Event.models");
const { startOfDay, endOfDay } = require("date-fns");
const { isAuthenticated } = require("../middleware/isAuthenticated");

router.get("/", async (req, res, next) => {
  try {
    if (Object.keys(req.query).length === 0) {
      const allEvents = await EventModel.find().populate("lineUp");
      res.json(allEvents);
    } else {
      const eventNameRegex = new RegExp(req.query.eventName, "i");
      const locationRegex = new RegExp(req.query.location, "i");
      const query = {
        eventName: eventNameRegex,
        location: locationRegex,
        ...(req.query.artistsid // Remove lineUp field when there is no artistid in query parameters
          ? { lineUp: new Types.ObjectId(req.query.artistsid) }
          : {}),
        ...(req.query.date
          ? {
              // https://stackoverflow.com/a/27641025
              date: {
                $gte: startOfDay(new Date(req.query.date)),
                $lte: endOfDay(new Date(req.query.date)),
              },
            }
          : {}),
      };

      console.log(query);
      const events = await EventModel.find(query).populate("lineUp");

      res.json(events);
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send();
  }
});

router.delete("/:eventId", isAuthenticated, async (req, res, next) => {
  try {
    const { eventId } = req.params;
    await EventModel.findByIdAndDelete(eventId);
    res.status(204);
  } catch (error) {
    console.error(error);
    res.status(500);
  } finally {
    res.send();
  }
});
router.put("/:eventId", isAuthenticated, async (req, res) => {
  const { eventId } = req.params;
  const payload = req.body;
  try {
    const updatedEvent = await EventModel.findByIdAndUpdate(eventId, payload, {
      new: true,
    });
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  const payload = req.body;

  try {
    const addEvent = await EventModel.create(payload);
    res.status(201).json(addEvent);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneEvent = await EventModel.findById(id).populate("lineUp");
    res.json(oneEvent);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

module.exports = router;
