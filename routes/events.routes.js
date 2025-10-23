const router = require('express').Router();
const { Op } = require('sequelize');
const Event = require('../models/Event.model.new');
const Artist = require('../models/Artist.model.new');
const { startOfDay, endOfDay } = require('date-fns');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// GET /events
router.get('/', async (req, res, next) => {
  try {
    const where = {};
    const include = [{ model: Artist, through: { attributes: [] } }];

    if (req.query.eventName) {
      where.eventName = { [Op.like]: `%${req.query.eventName}%` };
    }
    if (req.query.location) {
      where.location = { [Op.like]: `%${req.query.location}%` };
    }
    if (req.query.date) {
      where.date = {
        [Op.between]: [startOfDay(new Date(req.query.date)), endOfDay(new Date(req.query.date))],
      };
    }
    if (req.query.artistsid) {
      include[0].where = { id: req.query.artistsid };
    }

    const events = await Event.findAll({ where, include });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// DELETE /events/:eventId
router.delete('/:eventId', isAuthenticated, async (req, res, next) => {
  try {
    const { eventId } = req.params;
    await Event.destroy({ where: { id: eventId } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// PUT /events/:eventId
router.put('/:eventId', isAuthenticated, async (req, res) => {
  const { eventId } = req.params;
  const payload = req.body;
  try {
    await Event.update(payload, { where: { id: eventId } });
    const updatedEvent = await Event.findByPk(eventId, { include: [{ model: Artist, through: { attributes: [] } }] });
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// POST /events
router.post('/', isAuthenticated, async (req, res, next) => {
  const payload = req.body; // may contain `artistIds` array
  try {
    const { artistIds, ...eventData } = payload;
    const addEvent = await Event.create(eventData);
    if (artistIds && Array.isArray(artistIds)) {
      const artists = await Artist.findAll({ where: { id: artistIds } });
      await addEvent.addArtists(artists);
    }
    const created = await Event.findByPk(addEvent.id, { include: [{ model: Artist, through: { attributes: [] } }] });
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// GET /events/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const oneEvent = await Event.findByPk(id, { include: [{ model: Artist, through: { attributes: [] } }] });
    if (!oneEvent) return res.status(404).json({ error: 'Event not found' });
    res.json(oneEvent);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

module.exports = router;
