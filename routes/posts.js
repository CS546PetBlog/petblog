const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const data = require('../data');
const users = data.users;

router.get('/', function (req, res) {
    var username = req.session.user;
   console.log(req.session.user)
    res.render('posts/add', {layout: false, username: username });
  });
  
module.exports = router;