const router = require("express").Router();
const mongoose = require ('mongoose')

const User = require('../models/User.model')

const { isAuthenticated } = require('../middleware/isAuthenticated')

router.get('/', isAuthenticated, async(req, res, next) => {
  try {
    const user = await User.findById(req.payload.userId)
    res.status(200).json(user, { message: 'All good with profile'})
  } catch(err){
    console.log(err)
  }
})

router.get("/:profileId", isAuthenticated, async (req, res, next) => {
  try {
    const profileToEdit = await User.findById(req.payload.userId)
    console.log(profileToEdit)
    res.status(200).json(profileToEdit);
  }
  catch(err) {
    console.error(err)
  }
});

module.exports = router;