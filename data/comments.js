
const { ObjectID } = require('bson');
const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const commentsCollection = mongoCollections.comments;
const postsCollection = mongoCollections.posts;

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
    if (!validators.validID) {
        throw "Error: invalid input";
    }

    const comments = await commentsCollection();
    return await comments.find({postID: new ObjectId(postID)}).toArray();;
}


module.exports = {
    create,
    getAll
}