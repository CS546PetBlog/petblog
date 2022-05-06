const router = require("express").Router();
const authorize = require("../authorize.js");

router.get("/", authorize, function(req, res) {
    res.send("I am working!");
})

router.get('/logout', async (req, res) => {
    res.render('login/logout', { layout: false });
    res.clearCookie('AuthCookie');
    req.session.destroy(); 
  });
module.exports = router;