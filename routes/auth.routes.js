const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const { isAuthenticated } = require('../middleware/isAuthenticated')

const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

//should match SessionContext fetch url
//has to be updated!!
router.get("/verify", (req, res, next) => {
  res.json("All good in here");
});

router.post("/signup", async (req, res, next) => {
  const salt = bcrypt.genSaltSync(9)
  const passwordHash = bcrypt.hashSync(req.body.password, salt)
  try {
    await User.create({email: req.body.email, password: passwordHash})
    res.status(201).json({ message: 'New user created' })
  }
  catch(err){
    console.error(err)
  }
})

module.exports = router;