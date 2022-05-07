
const mongoCollections = require('../config/mongoCollections');
const postsCollection = mongoCollections.posts;

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
        return {accountInserted: true}
    }
    else {
        throw "Error: internal server error";
    }
}

const getAll = async function() {
    const posts = await postsCollection();
    return await posts.find({}).toArray();;
}

module.exports = {
    create,
    getAll
}