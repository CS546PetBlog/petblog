

const authorize = async function(req, res, next) {
    if (req.session.AuthCookie) {
        next();
        return;
    }
    res.redirect("/login");
}

module.exports = authorize;