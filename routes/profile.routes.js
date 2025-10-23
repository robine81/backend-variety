const User = require('../models/User.model.new');
const bcrypt = require('bcryptjs');
const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.json('All good in here');
});

router.post('/edit', async (req, res, next) => {
  try {
    const potentialUser = await User.findOne({ where: { email: req.body.email } });
    if (!potentialUser) return res.status(404).json({ error: 'User not found' });

    let payload = req.body;
    if (payload.password) {
      const salt = bcrypt.genSaltSync(9);
      payload.password = bcrypt.hashSync(payload.password, salt);
    } else {
      const { password, ...rest } = payload;
      payload = rest;
    }

    await User.update(payload, { where: { id: potentialUser.id } });
    const updatedProfile = await User.findByPk(potentialUser.id);
    res.status(200).json(updatedProfile);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;
