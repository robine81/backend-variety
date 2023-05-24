const User = require("../models/User.model");
const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.post("/edit", async (req,res,next) => {

  const potentialUser = await User.findOne({ email: req.body.email });
  const payload = req.body;
  try {
    const updatedProfile = await User.findByIdAndUpdate(potentialUser._id, payload, {
      new: true,
    });
    res.status(200).json(updatedProfile);
  } catch (error) {
    console.log(error);
  }
})


module.exports = router;