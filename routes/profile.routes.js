const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.post("/edit", async (req, res, next) => {
  const potentialUser = await User.findOne({ email: req.body.email });
  let payload = req.body;
  if (payload.password) {
    const salt = bcrypt.genSaltSync(9);
    payload.password = bcrypt.hashSync(payload.password, salt);
  } else {
    const { password, ...rest } = payload;
    payload = rest;
  }
  try {
    const updatedProfile = await User.findByIdAndUpdate(
      potentialUser._id,
      payload,
      {
        new: true,
      }
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
