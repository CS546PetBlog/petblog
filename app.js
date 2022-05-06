const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const users= require('./data/users');
app.use(express.urlencoded({extended: true}));
const static = express.static(__dirname + '/public');
app.use('/public', static);
app.use(express.json());
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(
  session({
      name: 'AuthCookie',
      secret: 'some secret string!',
      resave: false,
      saveUninitialized: true,
  })
);
// console log WORKS
app.use(async (req, res, next) => {
  console.log(
      '[' +
          new Date().toUTCString() +
          ']: ' +
          req.method +
          ' ' +
          req.originalUrl +
          ' (' +
          (req.session.user
              ? 'Authenticated User'
              : 'Non-Authenticated User') +
          ')'
  );
  next();
});
app.use('/private', async (req, res, next) => {
  if (!req.session.user) {
      res.status(403);
      res.render('home/notloggedin', { layout: false });
  } else {
      next();
  }
});


configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
