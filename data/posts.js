
const { ObjectID } = require('bson');
const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const postsCollection = mongoCollections.posts;
const ratingsCollection = mongoCollections.ratings;

const validators = require("../validators");


const create = async function(username, title, filename, tag, body) {
    if (!validators.validString(username) || !validators.validString(title) || !validators.validString(filename) || !validators.validString(tag) || !validators.validString(body)) {
        throw "Error: invalid input";
    }

    const posts = await postsCollection();
    
    const res = await posts.insertOne({
        username: username,
        title: title,
        image: filename,
        tag: tag,
        body: body,
        date: Date.now()/1000|0
    });

    if (res.insertedId) {
        return {postInserted: true}
    }
    else {
        throw "Error: internal server error";
    }
}

const getAll = async function() {
    const posts = await postsCollection();
    return await posts.find({}).toArray();;
}

const get = async function(idStr) {
    if (!validators.validID(idStr)) {
        throw "Error: invalid input";
    }

    const posts = await postsCollection();
    const a_post = await posts.findOne({_id: new ObjectId(idStr)});

    if (!a_post) {
        throw "Error: post does not exist";
    }
    return a_post;
}

const likePost = async function(username, postID) {
    if (!validators.validString(username) || !validators.validID(postID)) {
        throw "Error: invalid input";
    }

    const ratings = await ratingsCollection();
    
    const a_rating = await ratings.findOne({username: username, postID: new ObjectId(postID)});
    if (!a_rating) {
        const res = await ratings.insertOne({ username: username, postID: new ObjectId(postID) });
        if (res.insertedId) {
            return {ratingInserted: true}
        }
        else {
            throw "Error: internal server error"
        }
    }

    throw "Error: user already liked the post";
}

const unLikePost = async function(username, postID) {
    if (!validators.validString(username) || !validators.validID(postID)) {
        throw "Error: invalid input";
    }

    const ratings = await ratingsCollection();

    await ratings.deleteMany({username: username, postID: new ObjectId(postID)});
}

const getRating = async function(username, postID) {
    if (!validators.validString(username) || !validators.validID(postID)) {
        throw "Error: invalid input";
    }

    const ratings = await ratingsCollection();
    return await ratings.findOne({username: username, postID: new ObjectId(postID)});
}

const sumLikes = async function(postID) {
    if (!validators.validID(postID)) {
        throw "Error: invalid input";
    }

    const ratings = await ratingsCollection();

    const allRatings = await ratings.find({postID: new ObjectId(postID)}).toArray();
    return allRatings.length;
}

module.exports = {
    create,
    getAll,
    get,
    likePost,
    unLikePost,
    sumLikes,
    getRating
}