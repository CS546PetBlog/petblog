const router = require("express").Router();
const authorize = require("../authorize.js");
const multer = require("multer");
const path = require("path");
const uuid = require('uuid');
const pets = require("../../data/pets");

const validators = require("../../validators");

const upload = multer({
    dest: path.join(__dirname, "../../public/images")
});

router.get("/", authorize, async function (req, res) {
    try {
        var allPets = await pets.getAll();

        allPets = allPets.map(function (pet) {

            var temp = pet;
            temp.image = `/public/images/${pet.image}`
            temp.link = `/pets/${pet._id.toString()}`
            return temp;
        })
        res.status(200).render("home/pets", { pets: allPets });
    }
    catch (e) {
        res.status(500).render("error/error", { error: "Error: internal server error", redirect: "/pets" });
    }
})

router.post("/", authorize, async function (req, res) {
    try {
        var query = {};
        req.body.name ? (validators.validString(req.body.name) ? query.animalName = req.body.name : true) : true;
        req.body.type ? (validators.validString(req.body.type) ? query.animalType = req.body.type : true) : true;
        req.body.age ? (validators.validInt(req.body.age) ? query.animalAge = parseInt(req.body.age) : true) : true;
        req.body.zip ? (validators.validZip(req.body.zip) ? query.zipcode = req.body.zip : true) : true;
        req.body.tag ? (validators.validString(req.body.tag) ? query.tag = req.body.tag : true) : true;

        var allPets = await pets.getAll(query);
        allPets = allPets.map(function (pet) {
            var temp = pet;
            temp.image = `/public/images/${pet.image}`
            temp.link = `/pets/${pet._id.toString()}`
            return temp;
        })
        res.status(200).render("home/pets", { pets: allPets });
    }
    catch (e) {
        res.status(500).render("error/error", { error: "Error: internal server error", redirect: "/pets" });
    }
})

router.get("/create", authorize, async function (req, res) {
    res.render("pets/add");
});

router.get("/:id", authorize, async function (req, res) {
    try {
        if (!validators.validID(req.params.id)) {
            throw "Error: invalid input";
        }

        var a_pet = await pets.get(req.params.id);
        a_pet.image = `/public/images/${a_pet.image}`
        a_pet.commentURI = `/pets/${req.params.id}/comment`
        a_pet._id = a_pet._id.toString();

        res.status(200).render("pets/display", { pet: a_pet });
    }
    catch (e) {
        if (e == "Error: invalid input") {
            res.status(400).render("error/error", { error: e, redirect: "/pets" });
        }
        else {
            res.status(500).render("error/error", { error: "Error: internal server error", redirect: "/pets" });
        }
    }
})

router.post('/create', authorize, upload.single('file'), async function (req, res) {
    try {
        if (!req.file) {
            throw "Error: no file submited";
        } 
        else {
            if (
                !validators.validString(req.session.AuthCookie) || 
                !validators.validString(req.body.name) || 
                !validators.validString(req.body.type) || 
                !validators.validInt(parseInt(req.body.age)) || 
                !validators.validZip(req.body.zip) || 
                !validators.validString(req.body.description) || 
                !validators.validString(req.body.tag) ||
                !validators.validString(req.file.filename)
                ) {
                throw "Error: invalid input";
            }
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
    }
    catch (e) {
        if (e == "Error: invalid input") {
            res.status(400).render("error/error", { error: e, redirect: "/pets" });
        }
        else {
            res.status(500).render("error/error", { error: "Error: internal server error", redirect: "/pets"});
        }
    }
});

router.post("/:id/transfer", authorize, async function (req, res) {
    try {
        if (!validators.validID(req.params.id) || !validators.validString(req.body.newowner)) {
            throw "Error: invalid input";
        }
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
    catch (e) {
        if (e == "Error: invalid input" || e == "Error: user does not exist" || e == "Error: pet does not exist") {
            res.status(400).render("error/error", { error: e, redirect: `/pets/${req.params.id}` });
        }
        else {
            res.status(500).render("error/error", { error: "Error: internal server error", redirect: `/pets/${req.params.id}` });
        }
    }
})

module.exports = router;