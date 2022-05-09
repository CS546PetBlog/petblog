const dotenv = require("dotenv");
dotenv.config();

const accountsCollection = require("../config/mongoCollections").accounts
const postsCollection = require("../config/mongoCollections").posts
const petsCollection = require("../config/mongoCollections").pets

const seed = async function () {
    const accounts = await accountsCollection();
    await accounts.insertOne({
        "username": "admin",
        "hashpass": "$2a$10$B7iLM6nEdSgFuNrAU2FVyu7EmB3MJkEnXyb0G10dNyhJRDn2XxIqi",
        "name": null,
        "bio": null,
        "picture": null
    });

    

    process.exit();
}

seed();