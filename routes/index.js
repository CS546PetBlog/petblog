const accountRoutes = require('./accounts');
const petRoutes = require('./pets');
const postRoutes = require('./posts');
const commentRoutes = require('./comments');
const ratingRoutes = require('./ratings');

const constructorMethod = (app) => {
    //app.use('/', idk);
    app.use('/accounts', accountRoutes);
    app.use('/pets', petRoutes);
    app.use('/posts', postRoutes);
    app.use('/comments', commentRoutes);
    app.use('/ratings', ratingRoutes);
    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;