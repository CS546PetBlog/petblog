const router = require("express").Router();
const authorize = require("../authorize.js");
const comments = require("../../data/comments");

router.post("/:commentid/like", authorize, async function(req, res) {
    try {
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
        console.log(e);
        res.render("error/error", {error: "Failed to like comment", redirect: "/posts"})
    }
});

router.post("/:commentid/unlike", authorize, async function(req, res) {
    try {
        const comment = await comments.get(req.params.commentid);
        const result = await comments.unLikeComment(req.session.AuthCookie, req.params.commentid);
        res.redirect(`/posts/${comment.postID.toString()}`);
    }
    catch(e) {
        console.log(e);
        res.render("error/error", {error: "Failed to unlike comment", redirect: `/posts`})
    }
});

module.exports = router;