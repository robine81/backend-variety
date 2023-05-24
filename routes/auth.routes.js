const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const {
  isAuthenticated,
  getTokenFromHeaders,
} = require("../middleware/isAuthenticated");

const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

//should match SessionContext fetch url
//has to be updated!!
router.get("/verify", (req, res, next) => {
  res.json("All good in here session context");
});

router.post("/signup", async (req, res, next) => {
  const salt = bcrypt.genSaltSync(9);
  const passwordHash = bcrypt.hashSync(req.body.password, salt);
  try {
    await User.create({ email: req.body.email, password: passwordHash });
    res.status(201).json({ message: "New user created" });
  } catch (err) {
    console.error(err);
  }
});

// POST to login
router.post("/login", async (req, res) => {
  try {
    const potentialUser = await User.findOne({ email: req.body.email });

    if (potentialUser) {
      if (bcrypt.compareSync(req.body.password, potentialUser.password)) {
        const authToken = jwt.sign(
          { userId: potentialUser._id },
          process.env.TOKEN_SECRET,
          {
            algorithm: "HS256",
            expiresIn: "6h",
          }
        );
        res.json({
          authToken,
          user: {
            id: potentialUser._id,
            email: potentialUser.email,
            firstName: potentialUser.firstName,
            lastName: potentialUser.lastName,
          },
        });
      } else {
        res.status(401).json({ errorMessage: "Wrong password, try again" });
      }
    } else {
      res.status(401).json({ errorMessage: "Invalid user" });
    }
  } catch (error) {
    console.log(error);
  }
});

// router.get("/me", (req, res, next) => {
//   const token = getTokenFromHeaders(req);
//   try {
//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
//     res.json(decoded);
//   } catch (error) {
//     return res.status(401).send("unauthorized");
//   }
// });

module.exports = router;
