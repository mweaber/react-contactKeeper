const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// @route       POST api/users
// @desc        Register a user
// @access      Public
router.post(
  '/',
  // Below is the express-validator
  // Checking that json has all required info.
  [
    check('name', 'Please add name.')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email.').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6
    })
  ],
  // Awaiting error messages from validation.
  async (req, res) => {
    const errors = validationResult(req);
    // If error then return bad request from user.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Try/Catch for looking up user in DB
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        name,
        email,
        password
      });

      // Variable for bcrypt salt
      const salt = await bcrypt.genSalt(10);

      // Hashing user password with bcrypt salt.
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Created payload for jwt in separate variable.
      const payload = {
        user: {
          id: user.id
        }
      };

      // Jwt token, set secret in config file. JWT takes in three params (payload, secret, callback)
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          // If no errors return token.
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      // You will get error if not in test in config for db. Atlas does not allow raw json from postman as admin in atlas.
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
