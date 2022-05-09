const dotenv = require("dotenv");
dotenv.config();

const accountsCollection = require("../config/mongoCollections").accounts
const postsCollection = require("../config/mongoCollections").posts
const petsCollection = require("../config/mongoCollections").pets

const seed = async function () {
    const accounts = await accountsCollection();

    // Password is 1234
    await accounts.insertOne({
        "username": "user",
        "hashpass": "$2a$10$WiMPiekG6eF3ehudpPIj2.yuMhCJhRFgP3CpTSxDD2yk9kKDn6vh6",
        "name": null,
        "bio": null,
        "picture": null
    });

    // Password is 1234
    await accounts.insertOne({
        "username": "user1",
        "hashpass": "$2a$10$aTA/t9LS0qbRe/Qo6Xe1D.k1yXPuLp0JL0TjcYRDujZpfjOkVvpyK",
        "name": null,
        "bio": null,
        "picture": null
    });

    const pets = await petsCollection();
    await pets.insertOne({
        "username": "user1",
        "animalName": "Adam",
        "animalType": "dog",
        "animalAge": 2,
        "zipcode": "07053",
        "description": "adam is a very funny pet",
        "tag": "funny",
        "image": "0ae88b1b20944ffdecbe8bf86c9011a4",
        "priorOwners": [
            "user"
        ]
    })

    await pets.insertOne({
        "username": "user",
        "animalName": "Joe",
        "animalType": "cat",
        "animalAge": 1,
        "zipcode": "07946",
        "description": "a very small cat",
        "tag": "small",
        "image": "0ae88b1b20944ffdecbe8bf86c9011a4",
        "priorOwners": []
    })

    const posts = await postsCollection();
    await posts.insertOne({
        "username": "user",
        "title": "My new pet",
        "image": "0ae88b1b20944ffdecbe8bf86c9011a4",
        "tag": "pet",
        "body": "here is my new pet",
        "date": 1652057697
    })

    process.exit();
}

seed();