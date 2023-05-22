const router = require("express").Router();
const mongoose = require ('mongoose')

const User = require('../models/User.model')

const { isAuthenticated } = require('../middleware/isAuthenticated')

router.get('/', isAuthenticated, (req, res, next) => {
  res.json('All good in here')
})

router.get("/:profileId", isAuthenticated, async (req, res, next) => {
  try {
    const profileToEdit = await User.findById(req.params.profileId)
    console.log(profileToEdit)
    res.json(profileToEdit);
  }
  catch(err) {
    console.error(err)
  }

});

module.exports = router;