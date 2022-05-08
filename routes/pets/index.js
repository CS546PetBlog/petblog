const router = require("express").Router();
const authorize = require("../authorize.js");
const multer = require("multer");
const path = require("path");
const uuid = require('uuid');
const pets = require("../../data/pets");

const upload = multer({
    dest: path.join(__dirname, "../../public/images")
});

router.get("/", authorize, async function(req, res) {
    var allPets = await pets.getAll();

    allPets = allPets.map(function(pet) {

        var temp = pet;
        temp.image = `/public/images/${pet.image}`
        temp.link = `/pets/${pet._id.toString()}`
        return temp;
    })
    res.render("home/pets", {pets: allPets});
})

router.post("/", authorize, async function(req, res) {
    var query = {};
    req.body.name ? query.animalName = req.body.name : true;
    req.body.type ? query.animalType = req.body.type : true;
    req.body.age ? query.animalAge = parseInt(req.body.age) : true;
    req.body.zip ? query.zipcode = req.body.zip : true;
    req.body.tag ? query.tag = req.body.tag : true;

    var allPets = await pets.getAll(query);
    allPets = allPets.map(function(pet) {
        var temp = pet;
        temp.image = `/public/images/${pet.image}`
        temp.link = `/pets/${pet._id.toString()}`
        return temp;
    })
    res.render("home/pets", {pets: allPets});
})

router.get("/create", authorize, async function (req, res) {
    res.render("pets/add");
});

router.get("/:id", authorize, async function(req, res) {
    try {
        var a_pet = await pets.get(req.params.id);
        a_pet.image = `/public/images/${a_pet.image}`
        a_pet.commentURI = `/pets/${req.params.id}/comment`
        a_pet._id = a_pet._id.toString();

        res.render("pets/display", {pet: a_pet});
    }
    catch (e) {
        console.log(e);
        res.render("error/error", {error: "Error: could not get requested resource", redirect: "/pets"});
    }
})

router.post('/create', authorize, upload.single('file'), async function(req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });

    } else {
        try {
            console.log(req.body);
            const result = await pets.create(
                req.session.AuthCookie,
                req.body.name,
                req.body.type,
                parseInt(req.body.age),
                req.body.zip,
                req.body.description,
                req.body.tag,
                req.file.filename
            );

            if (result.petInserted) {
                res.redirect("/pets");
            }
            else {
                throw "Error: internal server error";
            }
        }
        catch(e) {
            console.log(e);
            if (e == "Error: invalid input") {
                res.render("pets/add", {error: e});
            }
            else {
                res.render("pets/add", {error: "Error: internal server error"});
            }
        }
    }
});

router.post("/:id/transfer", authorize, async function(req, res) {
    try {
        const pet = await pets.get(req.params.id);
        if (pet.username != req.session.AuthCookie) {
            throw "Error: unauthorized";
        }
        const result = await pets.transferOwnership(req.params.id, req.body.newowner);

        if (!result) {
            throw "Error: internal server error"
        }
        res.redirect(`/pets/${req.params.id}`);
    }
    catch(e) {
        if (e == "Error: invalid input" || e == "Error: user does not exist" || e == "Error: pet does not exist") {
            res.status(400).render("error/error", {error: e, redirect: `/pets/${req.params.id}`});
        }
        else {
            res.status(400).render("error/error", {error: "Error: internal server error", redirect: `/pets/${req.params.id}`});
        }
    }
}) 

module.exports = router;