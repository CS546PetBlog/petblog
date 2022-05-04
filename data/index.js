const accounts = require('./accounts');
const pets = require('./pet');
const posts = require('./posts');
const comments = require('./comments');
const ratings = require('./ratings');

module.exports = {
    account: accounts,
    pet: pets,
    post: posts,
    comment: comments,
    ratings: ratings
};