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

// POST to login
router.post('/login', async (req, res) => {
  // Does user exists
  const potentialUser = await User.findOne({ email: req.body.email })
  if (potentialUser) {
    // Is the password correct
    if (bcrypt.compareSync(req.body.password, potentialUser.password)) {
      // Password IS correct
      const authToken = jwt.sign({ userId: potentialUser._id }, process.env.TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '6h',
      })
      res.json(authToken)
    } else {
      // Password ISN'T correct
    }
  } else {
    // No user found
  }
})

// GET to verify
router.get('/verify', isAuthenticated, async (req, res) => {
  const user = await User.findById(req.pizza.userId)
  res.status(200).json({ message: 'User is authenticated', user })
})

module.exports = router;