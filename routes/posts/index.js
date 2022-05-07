const router = require("express").Router();
const authorize = require("../authorize.js");
const multer = require("multer");
const path = require("path");
const uuid = require('uuid');

const posts = require("../../data/posts");

const upload = multer({
    dest: path.join(__dirname, "../../public/images")
});

router.get("/", authorize, async function (req, res) {
    const allPosts = posts.getAll();
    res.render("home/posts");
});

router.get("/create", authorize, async function (req, res) {
    res.render("posts/add");
});

router.post('/create', authorize, upload.single('file'), async function(req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });

    } else {
        try {
            const result = await posts.create(req.session.AuthCookie, req.body.title, req.file.filename, req.body.Tag, req.body.body);
            res.redirect("/posts");
        }
        catch(e) {
            console.log(e);
            if (e == "Error: invalid input") {
                res.render("posts/add", {error: e});
            }
            else {
                res.render("posts/add", {error: "Error: internal server error"});
            }
        }
    }
});

module.exports = router;