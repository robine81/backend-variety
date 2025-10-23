const router = require('express').Router();
const Artist = require('../models/Artist.model.new');
const { Op } = require('sequelize');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// GET /artists
router.get('/', async (req, res, next) => {
  try {
    const where = {};
    if (req.query.artistName) where.artistName = { [Op.like]: `%${req.query.artistName}%` };
    if (req.query.soundCloudUrl) where.soundCloudUrl = { [Op.like]: `%${req.query.soundCloudUrl}%` };

    const artists = await Artist.findAll({ where });
    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// GET /artists/:id
router.get('/:id', async (req, res, next) => {
  try {
    const artistId = req.params.id;
    const artist = await Artist.findByPk(artistId);

    if (!artist) return res.status(404).json({ error: 'Artist not found' });

    res.json(artist);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// POST /artists/add
router.post('/add', isAuthenticated, async (req, res, next) => {
  try {
    const payload = req.body;
    const createdArtist = await Artist.create(payload);
    res.status(201).json(createdArtist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create artist' });
  }
});

// DELETE /artists/:artistId
router.delete('/:artistId', isAuthenticated, async (req, res, next) => {
  try {
    const { artistId } = req.params;
    await Artist.destroy({ where: { id: artistId } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// PUT /artists/:artistId
router.put('/:artistId', isAuthenticated, async (req, res) => {
  const { artistId } = req.params;
  const payload = req.body;
  try {
    await Artist.update(payload, { where: { id: artistId } });
    const updatedArtist = await Artist.findByPk(artistId);
    res.status(200).json(updatedArtist);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;