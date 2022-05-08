
const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const petsCollection = mongoCollections.pets;
const accountsCollection = mongoCollections.accounts;

const validators = require("../validators");


const create = async function(username, animalName, animalType, animalAge, zipcode, description, tag, image) {
    if (
        !validators.validString(username) || 
        !validators.validString(animalName) || 
        !validators.validString(animalType) || 
        !validators.validInt(animalAge) || 
        !validators.validZip(zipcode) || 
        !validators.validString(description) || 
        !validators.validString(tag) ||
        !validators.validString(image)
        ) {
        throw "Error: invalid input";
    }

    const pets = await petsCollection();
    
    const res = await pets.insertOne({
        username: username,
        animalName: animalName,
        animalType: animalType,
        animalAge: animalAge,
        zipcode: zipcode,
        description: description,
        tag: tag,
        image: image,
        priorOwners: []
    });

    if (res.insertedId) {
        return {petInserted: true}
    }
    else {
        throw "Error: internal server error";
    }
}

const getAll = async function(query) {
    const pets = await petsCollection();
    if (query && typeof query == "object") {
        return await pets.find(query).toArray();
    }
    return await pets.find({}).toArray();
}

const get = async function(idStr) {
    if (!validators.validID(idStr)) {
        throw "Error: invalid input";
    }

    const pets = await petsCollection();
    const a_pet = await pets.findOne({_id: new ObjectId(idStr)});

    if (!a_pet) {
        throw "Error: pet does not exist";
    }
    return a_pet;
}

const transferOwnership = async function(petID, newOwner) {
    if (!validators.validID(petID) || !validators.validString(newOwner)) {
        throw "Error: invalid input"
    }

    const pets = await petsCollection();
    const accounts = await accountsCollection();

    const a_account = await accounts.findOne({username: newOwner});
    if (!a_account) {
        throw "Error: user does not exist"
    }

    const a_pet = await pets.findOne({_id: new ObjectId(petID)});
    if (!a_pet) {
        throw "Error: pet does not exist";
    }

    const oldOwner = a_pet.username;
    const result = await pets.updateOne(
        {_id: new ObjectId(petID)},
        {$set: {username: newOwner}, $push: {priorOwners: oldOwner}}
    )
    
    if (result.modifiedCount) {
        return true;
    }
}

module.exports = {
    create,
    getAll,
    get,
    transferOwnership
}