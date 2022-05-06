const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const data = require('../data');
const users = data.users;

//get signup works
router.get('/', async (req, res) => {
    if (req.session.user) {
      res.redirect('/private');
  } else {
    res.render('home/signup', {});
  }
  });
  //post signup WORKS
router.post('/', async (req, res) => {
    var userName = req.body.username;
    var password = req.body.password;

    try {
    if(!userName || !password) return res.status(400).render('home/signup', {err: true})
    if(!typeof userName === 'string' ||userName.trim().length === 0 ||userName.length < 4 || userName.indexOf(' ') >= 0 || userName.match(/^[0-9A-Za-z]+$/) === null) return res.status(400).render('home/signup', {err2: true})

    if(!typeof password === 'string' ||password.trim().length === 0 ||password.length < 6 || password.indexOf(' ') >= 0) return res.status(400).render('home/signup', {err1: true})
    
    let thisUser= await users.createUser(userName,password)
        console.log(thisUser)
    if (thisUser.userInserted === true) {
        return res.redirect('/');
    }
    if (thisUser.userInserted === false)  { 
        return res.status(400).render('home/signup', {err4: true})
        //err1: true, err2:true,err3:true, err:true
     }
        
    } catch (e) {
      res.status(500).render('home/notloggedin', {
        layout: false,
        error:
            'Error 500: User already exists'
    });
    }
  });
  module.exports = router;
