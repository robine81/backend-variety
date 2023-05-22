const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const { isAuthenticated } = require('../middleware/isAuthenticated')

const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// GET to verify
router.get('/verify', isAuthenticated, async (req, res) => {
  const user = await User.findById(req.payload.userId)
  console.log(user)
  res.status(200).json({ message: 'User is authenticated', user })
})

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
  // Is the password correct
  try {
    const potentialUser = await User.findOne({ email: req.body.email })
    if (potentialUser) {
    if (bcrypt.compareSync(req.body.password, potentialUser.password)) {
        // Password IS correct
        const authToken = jwt.sign({ expiresIn: '6h', userId: potentialUser._id }, process.env.TOKEN_SECRET, {
          algorithm: 'HS256',
        })
        res.status(200).json(authToken)
      } else {
        // If password is wrong

        res.status(401).json({ errorMessage: 'Wrong password' })
      }
    } else {
      // If we don't have a user with the given username
      res.status(404).json({ errorMessage: 'User does not exists' })
    }}
  catch(err){
    console.err(err)
  }
})

// GET to verify
router.get('/verify', isAuthenticated, async (req, res) => {
  const user = await User.findById(req.payload.userId)
  res.status(200).json({ message: 'User is authenticated', user })
})


module.exports = router;