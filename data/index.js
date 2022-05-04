const accounts = require('./accounts');
const animals = require('./animals');
const posts = require('./posts');
const comments = require('./comments');
const ratings = require('./ratings');

module.exports = {
    account: accounts,
    animal: animals,
    post: posts,
    comment: comments,
    ratings: ratings
};