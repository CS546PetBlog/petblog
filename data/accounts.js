const mongoCollections = require('../config/mongoCollections');
const accounts = mongoCollections.accounts;
let { ObjectId } = require('mongodb');
const { parse } = require('uuid');

const create = async function create(email, password, name, bio, picture) {
    if (!email || !password || !name || !bio || !picture) throw 'Not all attributes of account were provided!';

    if (typeof email != 'string' || typeof password != 'string' || typeof name != 'string' || typeof bio != 'string' || typeof picture != 'string')
        throw 'Attributes of account must be of type String!';


}