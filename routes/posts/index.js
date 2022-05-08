const router = require("express").Router();
const authorize = require("../authorize.js");
const multer = require("multer");
const path = require("path");
const uuid = require('uuid');

const posts = require("../../data/posts");
const comments = require("../../data/comments");

const validators = require("../../validators");

const upload = multer({
    dest: path.join(__dirname, "../../public/images")
});

router.get("/", authorize, async function (req, res) {
    var allPosts = await posts.getAll();

    allPosts = allPosts.map(function (post) {
        const postDate = new Date(post.date * 1000);

        var month = postDate.getUTCMonth() + 1;
        var day = postDate.getUTCDate();
        var year = postDate.getUTCFullYear();

        const date = `${day}/${month}/${year} ${postDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
        var temp = post;
        temp.image = `/public/images/${post.image}`
        temp.date = date;
        temp.link = `/posts/${post._id.toString()}`
        return temp;
    })
    res.status(200).render("home/posts", { posts: allPosts });
});

router.get("/create", authorize, async function (req, res) {
    res.status(200).render("posts/add");
});

router.get("/:id", authorize, async function (req, res) {
    try {
        if (!validators.validID(req.params.id)) {
            throw "Error: invalid id";
        }

        var a_post = await posts.get(req.params.id);
        a_post.image = `/public/images/${a_post.image}`
        a_post.commentURI = `/posts/${req.params.id}/comment`
        a_post._id = a_post._id.toString();
        var postComments = await comments.getAll(req.params.id);

        postComments = await Promise.all(postComments.map(async function (comment) {
            var temp = comment;
            temp.sum = await comments.sumLikes(comment._id.toString());
            temp._id = comment._id.toString();
            const rating = await comments.getRating(req.session.AuthCookie, comment._id.toString());
            temp.rating = rating ? true : false;
            return temp;
        }));

        const sum = await posts.sumLikes(req.params.id);
        const rating = await posts.getRating(req.session.AuthCookie, req.params.id);
        const val = rating ? true : false;
        res.status(200).render("posts/display", { post: a_post, comments: postComments, rating: val, ratingSum: sum });
    }
    catch (e) {
        if (e == "Error: invalid input" || e == "Error: post does not exist") {
            res.status(400).render("error/error", { error: e, redirect: "/posts" });
        }
        else {
            res.status(500).render("error/error", { error: "Error: internal server error", redirect: "/posts" });
        }
    }
})

router.post("/:id/comment", authorize, async function (req, res) {
    try {
        if (!validators.validID(req.params.id) || !validators.validString(req.body.comment)) {
            throw "Error: invalid id";
        }

        var result = await comments.create(req.session.AuthCookie, req.params.id, req.body.comment);
        if (result.commentInserted) {
            res.redirect(`/posts/${req.params.id}`);
        }
        else {
            throw "Error: internal server error"
        }
    }
    catch (e) {
        if (e == "Error: invalid id" || e == "Error: invalid input" || e == "Error: post does not exist") {
            res.status(400).render("error/error", { error: e, redirect: `/posts/${req.params.id}` })
        }
        else {
            res.status(500).render("error/error", { error: "Error: internal server error", redirect: `/posts/${req.params.id}` })
        }
    }
})

router.post("/:id/like", authorize, async function (req, res) {
    try {
        if (!validators.validID(req.params.id)) {
            throw "Error: invalid input";
        }

        const result = await posts.likePost(req.session.AuthCookie, req.params.id);
        if (result.ratingInserted) {
            res.redirect(`/posts/${req.params.id}`);
        }
        else {
            res.status(200).render("error/error", { error: "Failed to like post", redirect: `/posts/${req.params.id}` })
        }
    }
    catch (e) {
        if (e == "Error: invalid input" || e == "Error: user already liked the post") {
            res.status(400).render("error/error", { error: e, redirect: `/posts/${req.params.id}` })
        }
        else {
            res.status(500).render("error/error", { error: "Error: internal server error", redirect: `/posts/${req.params.id}` })
        }
    }
});

router.post("/:id/unlike", authorize, async function (req, res) {
    try {
        if (!validators.validID(req.params.id)) {
            throw "Error: invalid input";
        }

        const result = await posts.unLikePost(req.session.AuthCookie, req.params.id);
        res.redirect(`/posts/${req.params.id}`);
    }
    catch (e) {
        if (e == "Error: invalid input") {
            res.status(400).render("error/error", { error: e, redirect: `/posts/${req.params.id}` })
        }
        else {
            res.status(500).render("error/error", { error: "Error: internal server error", redirect: `/posts/${req.params.id}` })
        }
    }
});

router.post('/create', authorize, upload.single('file'), async function (req, res) {

    try {
        if (!req.file) {
            throw "Error: no file submited"
        } else {
            if (!validators.validString(req.session.AuthCookie) || !validators.validString(req.body.title) || !validators.validString(req.file.filename) || !validators.validString(req.body.tag) || !validators.validString(req.body.body)) {
                throw "Error: invalid input";
            }

            const result = await posts.create(req.session.AuthCookie, req.body.title, req.file.filename, req.body.tag, req.body.body);
            if (result.postInserted) {
                res.redirect("/posts");
            }
            else {
                throw "Error: internal server error";
            }
        }
    }
    catch (e) {
        if (e == "Error: invalid input" || e == "Error: no file submited") {
            res.status(400).render("error/error", { error: e, redirect: "/posts" });
        }
        else {
            res.status(500).render("error/error", { error: "Error: internal server error", redirect: "/posts" });
        }
    }
});

module.exports = router;