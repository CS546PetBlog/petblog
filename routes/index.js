const userRoutes = require('./users');
const privateRoutes = require('./private');
const signupRoutes = require('./signup');
const postRoutes = require('./posts');
const petRoutes = require('./pets');



const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use('/private', privateRoutes);
  app.use('/signup', signupRoutes);
  app.use('/posts', postRoutes);
  app.use('/pets', petRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
