const accountRoutes = require('./accounts');
const petRoutes = require('./pets');
const postRoutes = require('./posts');
const commentRoutes = require('./comments');
const ratingRoutes = require('./ratings');

const authorize = require("./authorize.js");

const constructorMethod = (app) => {
    app.use('/api/accounts', accountRoutes);
    app.use('/api/pets', petRoutes);
    app.use('/api/posts', postRoutes);
    app.use('/api/comments', commentRoutes);
    app.use('/api/ratings', ratingRoutes);

    app.get("/", authorize, function(req, res) {
        res.send("I am working!!!");
    });

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;