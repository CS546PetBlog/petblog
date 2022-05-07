
const mongoCollections = require('../config/mongoCollections');
const accountsCollection = mongoCollections.accounts;

const validators = require("../validators");
const crypto = require("../crypto");

const create = async function create(username, password) {
    if (!validators.validString(username) || !validators.validString(password)) {
        throw "Error: expected a string for inputs";
    }
    const accounts = await accountsCollection();
    const a_account = await accounts.findOne({username: username});

    if (!a_account) {
        const hashpass = await crypto.genHashPassword(password);
        const res = await accounts.insertOne({
            username: username,
            hashpass: hashpass,
            name: null,
            bio: null,
            picture: null
        });

        if (res.insertedId) {
            return {accountInserted: true}
        }
        else {
            throw "Error: internal server error";
        }
    }

    throw "Error: user already exists";
}

const get = async function(username) {
    if (!validators.validString(username)) {
        throw "Error: expected a string for inputs";
    }
    const accounts = await accountsCollection();
    const a_account = await accounts.findOne({username: username});

    return a_account;
}


module.exports = {
    create,
    get
}