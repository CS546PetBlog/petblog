const router = require("express").Router();

router.get("/", function(req, res) {
    res.send("I am working!");
})

module.exports = router;