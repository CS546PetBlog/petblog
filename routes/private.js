const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const data = require('../data');
const users = data.users;

// get private
router.get('/', function (req, res) {
  var username = req.session.user;
 console.log(req.session.user)
  res.render('home/loggedin', {layout: false, username: username });
});

module.exports = router;