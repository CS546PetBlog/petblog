const router = require("express").Router();
const authorize = require("../authorize.js");
const comments = require("../../data/comments");

const validators = require("../../validators");

router.post("/:commentid/like", authorize, async function(req, res) {
    try {
        if (!validators.validID(req.params.commentid)) {
            throw "Error: invalid input";
        }

        const comment = await comments.get(req.params.commentid);
        const result = await comments.likeComment(req.session.AuthCookie, req.params.commentid);
        if (result.ratingInserted) {
            res.redirect(`/posts/${comment.postID.toString()}`);
        }
        else {
            res.render("error/error", {error: "Failed to like comment", redirect: `/posts/${comment.postID.toString()}`})
        }
    }
    catch(e) {
        if (e == "Error: invalid input" || e == "Error: user already liked the comment") {
            res.status(400).render("error/error", {error: e, redirect: "/posts"})
        }
        else {
            res.status(500)/render("error/error", {error: "Error: internal server error", redirect: "/posts"})
        }
    }
});

router.post("/:commentid/unlike", authorize, async function(req, res) {
    try {
        if (!validators.validID(req.params.commentid)) {
            throw "Error: invalid input";
        }

        const comment = await comments.get(req.params.commentid);
        const result = await comments.unLikeComment(req.session.AuthCookie, req.params.commentid);
        res.redirect(`/posts/${comment.postID.toString()}`);
    }
    catch(e) {
        if (e == "Error: invalid input") {
            res.status(400).render("error/error", {error: e, redirect: "/posts"})
        }
        else {
            res.status(500)/render("error/error", {error: "Error: internal server error", redirect: "/posts"})
        }
    }
});

module.exports = router;