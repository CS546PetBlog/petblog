
const { ObjectID } = require('bson');
const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const commentsCollection = mongoCollections.comments;
const postsCollection = mongoCollections.posts;
const ratingsCollection = mongoCollections.ratings;

const validators = require("../validators");


const create = async function(username, postID, comment) {
    if (!validators.validString(username) || !validators.validID(postID) || !validators.validString(comment)) {
        throw "Error: invalid input";
    }

    const posts = await postsCollection();
    const comments = await commentsCollection();

    const a_post = await posts.findOne({_id: new ObjectId(postID)});

    if (!a_post) {
        throw "Error: post does not exist";
    }

    const res = await comments.insertOne({
        username: username,
        postID: new ObjectID(postID),
        comment: comment,
        date: Date.now()/1000|0
    });

    if (res.insertedId) {
        return {commentInserted: true}
    }
    else {
        throw "Error: internal server error";
    }
}

const getAll = async function(postID) {
    if (!validators.validID(postID)) {
        throw "Error: invalid input";
    }

    const comments = await commentsCollection();
    return await comments.find({postID: new ObjectId(postID)}).toArray();
}

const get = async function(commentID) {
    if (!validators.validID(commentID)) {
        throw "Error: invalid input";
    }

    const comments = await commentsCollection();
    return await comments.findOne({_id: new ObjectId(commentID)});
}

const likeComment = async function(username, commentID) {
    if (!validators.validString(username) || !validators.validID(commentID)) {
        throw "Error: invalid input";
    }

    const ratings = await ratingsCollection();
    
    const a_rating = await ratings.findOne({username: username, commentID: new ObjectId(commentID)});
    if (!a_rating) {
        const res = await ratings.insertOne({ username: username, commentID: new ObjectId(commentID) });
        if (res.insertedId) {
            return {ratingInserted: true}
        }
        else {
            throw "Error: internal server error"
        }
    }

    throw "Error: user already liked the comment";
}

const unLikeComment = async function(username, commentID) {
    if (!validators.validString(username) || !validators.validID(commentID)) {
        throw "Error: invalid input";
    }

    const ratings = await ratingsCollection();

    await ratings.deleteMany({username: username, commentID: new ObjectId(commentID)});
}

const getRating = async function(username, commentID) {
    if (!validators.validString(username) || !validators.validID(commentID)) {
        throw "Error: invalid input";
    }

    const ratings = await ratingsCollection();
    return await ratings.findOne({username: username, commentID: new ObjectId(commentID)});
}

const sumLikes = async function(commentID) {
    if (!validators.validID(commentID)) {
        throw "Error: invalid input";
    }

    const ratings = await ratingsCollection();

    const allRatings = await ratings.find({commentID: new ObjectId(commentID)}).toArray();
    return allRatings.length;
}

module.exports = {
    create,
    getAll,
    get,
    likeComment,
    unLikeComment,
    getRating,
    sumLikes
}