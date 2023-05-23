const router = require("express").Router();
const mongoose = require ('mongoose')

const User = require('../models/User.model')

const { isAuthenticated } = require('../middleware/isAuthenticated')

router.get('/', isAuthenticated, async(req, res, next) => {
  try {
    console.log("Req.params: ", req.params.profileId)
    const currentProfile = await User.findById(req.params.profileId)
    console.log("Current Profile: ", currentProfile)
    res.status(200).json({ message: 'All good with profile'})
  } catch(err){
    console.log(err)
  }
})

router.get("/:profileId", isAuthenticated, async (req, res, next) => {
  try {
    const profileToEdit = await User.findById(req.params.profileId)
    console.log(profileToEdit)
    res.status(200).json(profileToEdit);
  }
  catch(err) {
    console.error(err)
  }

});

module.exports = router;