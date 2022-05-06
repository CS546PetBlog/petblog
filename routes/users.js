const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const data = require('../data');
const users = data.users;

 router.get('/', async (req, res) => {
  if (req.session.user) {
      res.redirect('/private');
  } else {
      res.render('home/user', {});
  }
});

//post login
router.post('/login', async (req, res) => {
  var userName = req.body.username;
  var password = req.body.password;
  try {
    if(!userName || !password) return res.status(400).render('home/user', {err: true})

    if(!typeof userName === 'string' ||userName.trim().length === 0 ||userName.length < 4 || userName.indexOf(' ') >= 0 || userName.match(/^[0-9A-Za-z]+$/) === null) return res.status(400).render('home/user', {err2: true})

    if(!typeof password === 'string' ||password.trim().length === 0 ||password.length < 6 || password.indexOf(' ') >= 0) return res.status(400).render('home/user', {err1: true})
    
    let user = await users.checkUser(userName,password);
    if (user.authenticated === true) {
      req.session.user = userName;
      res.redirect('/private');
    }
  } catch (e) {
    res.status(400).render('home/user', {
      layout: false,
      err3: true,
      error:
          'Error 400: Invalid Password or UserName',
  });
  }
});
//get logout
router.get('/logout', async (req, res) => {
  res.render('home/logout', { layout: false });
  res.clearCookie('AuthCookie');
  req.session.destroy(); 
});
module.exports = router;
