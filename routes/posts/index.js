const router = require("express").Router();
const authorize = require("../authorize.js");
const multer = require("multer");
const path = require("path");
const uuid = require('uuid');

const posts = require("../../data/posts");
const comments = require("../../data/comments");

const upload = multer({
    dest: path.join(__dirname, "../../public/images")
});

router.get("/", authorize, async function (req, res) {
    var allPosts = await posts.getAll();

    allPosts = allPosts.map(function(post) {
        const postDate = new Date(post.date * 1000);

        var month = postDate.getUTCMonth() + 1;
        var day = postDate.getUTCDate();
        var year = postDate.getUTCFullYear();

        const date = `${day}/${month}/${year} ${postDate.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}`
        var temp = post;
        temp.image = `/public/images/${post.image}`
        temp.date = date;
        temp.link = `/posts/${post._id.toString()}`
        return temp;
    })
    res.render("home/posts", {posts: allPosts});
});

router.get("/create", authorize, async function (req, res) {
    res.render("posts/add");
});

router.get("/:id", authorize, async function(req, res) {
    try {
        var a_post = await posts.get(req.params.id);
        a_post.image = `/public/images/${a_post.image}`
        a_post.commentURI = `/posts/${req.params.id}/comment`

        var postComments = await comments.getAll(req.params.id);
        res.render("posts/display", {post: a_post, comments: postComments});
    }
    catch (e) {
        console.log(e);
        res.render("error/error", {error: "Error: could not get requested resource", redirect: "/posts"});
    }
})

router.post("/:id/comment", authorize, async function(req, res) {
    try {
        console.log(req.session.AuthCookie, req.body.comment, req.params.id)
        var result = await comments.create(req.session.AuthCookie, req.params.id, req.body.comment);
        if (result.commentInserted) {
            res.redirect(`/posts/${req.params.id}`);
        }
        else {
            res.render("error/error", {error: "Error: internal server error", redirect: `/${req.params.id}`})
        }
    }
    catch(e) {
        console.log(e);
        res.render("error/error", {error: "Error: failed to post comment", redirect: `/${req.params.id}`})
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