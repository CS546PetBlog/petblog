const userRoutes = require('./users');
const privateRoutes = require('./private');
const signupRoutes = require('./signup');

const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use('/private', privateRoutes);
  app.use('/signup', signupRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
