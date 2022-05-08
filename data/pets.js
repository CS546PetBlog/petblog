
const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const petsCollection = mongoCollections.pets;

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
        image: image
    });

    if (res.insertedId) {
        return {petInserted: true}
    }
    else {
        throw "Error: internal server error";
    }
}

const getAll = async function() {
    const pets = await petsCollection();
    return await pets.find({}).toArray();;
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

module.exports = {
    create,
    getAll,
    get
}