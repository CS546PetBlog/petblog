const userRoutes = require('./users');
const privateRoutes = require('./private');
const signupRoutes = require('./signup');
const postsRoutes = require('./posts');


const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use('/private', privateRoutes);
  app.use('/signup', signupRoutes);
  app.use('/posts', postRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
