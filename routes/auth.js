const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// @route       GET api/auth
// @desc        Get logged in user
// @access      Private
router.get('/', (req, res) => {
  res.send('Get logged in user');
});

// @route       Post api/auth
// @desc        Auth user and get token
// @access      Public
router.post(
  '/',
  [check('email', 'Please include a valid email.').isEmail(), 
   check('password', "Password is required").exists()],
   async (req, res) => {
    const errors = validationResult(req);
    // If error then return bad request from user.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email})
        
        if(!user){
            return res.status(400).json({msg:"Invalid Credentials"});
        }

        // Compare uses two params (plain-text pw, and the stored user password)
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({msg:'Invalid Credentials'});
        }

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
        res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
