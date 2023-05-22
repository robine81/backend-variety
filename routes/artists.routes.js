const router = require("express").Router();
const Artist = require('../models/Artist.model');
const { types } = require("mongoose");
const { isAuthenticated } = require("../middleware/isAuthenticated");

router.get("/", async (req, res, next) => {
  try {
    if (Object.keys(req.query).length === 0) {
      const allArtists = await Artist.find().populate("artistName");
      res.json(allArtists);
    } else {
      const artistNameRegex = new RegExp(req.query.artistName, "i");
      const soundCloudUrlRegex = new RegExp(req.query.soundCloudUrl, "i");
      const query = {
        artistName: artistNameRegex,
        soundCloudUrl: soundCloudUrlRegex,
      };

      console.log(query);
      const artists = await Artist.find(query).populate("artistName");

      res.json(artists);
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send();
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const artistId = req.params.id;
    const artist = await Artist.findById(artistId).populate("artistName");

    if (!artist) {
      // Handle case where artist is not found
      return res.status(404).json({ error: "Artist not found" });
    }

    res.json(artist);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.post('/add-artist', async (req, res, next) => {
  try {
    const { 
      artistName,
      firstName,
      lastName,
      artistPicUrl,
      soundCloudUrl,
      beatPortUrl,
      instagramUrl,
      facebookUrl,
      webPage, } = req.body
    console.log(req.body)

    const newArtist = new Artist({
      artistName,
      firstName,
      lastName,
      artistPicUrl,
      soundCloudUrl,
      beatPortUrl,
      instagramUrl,
      facebookUrl,
      webPage,
    })
    const createdArtist = await newArtist.save()
    res.status(201).json(createdArtist)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create artist'})
  } 
})

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const { artistId } = req.params;
    await Artist.findByIdAndDelete(artistId);
    res.status(204);
  } catch (error) {
    console.error(error);
    res.status(500);
  } finally {
    res.send();
  }
});
router.put("/update/:id", async (req, res) => {
  const { artistId } = req.params;
  const payload = req.body;
  try {
    const updatedArtist = await Artist.findByIdAndUpdate(artistId, payload, {
      new: true,
    });
    res.status(200).json(updatedArtist);
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;