const router = require("express").Router();
const authorize = require("../authorize.js");

router.get("/", authorize, function(req, res) {
    res.send("I am working!");
})

module.exports = router;