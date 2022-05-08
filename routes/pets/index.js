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

router.get("/create", authorize, async function (req, res) {
    res.render("pets/add");
});

router.get("/:id", authorize, async function(req, res) {
    try {
        var a_pet = await pets.get(req.params.id);
        a_pet.image = `/public/images/${a_pet.image}`
        a_pet.commentURI = `/pets/${req.params.id}/comment`

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

module.exports = router;