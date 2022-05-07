const accountRoutes = require('./accounts');
const petRoutes = require('./pets');
const postRoutes = require('./posts');
const commentRoutes = require('./comments');
const ratingRoutes = require('./ratings');

const accounts = require("../data/accounts");

const authorize = require("./authorize.js");
const session = require('express-session');

const {
    genHashPassword,
    compareHashPass,
    genRandomPassword
} = require("../crypto");

const constructorMethod = (app) => {
    app.use(session({
        name: 'AuthCookie',
        secret: genRandomPassword(),
        resave: false,
        saveUninitialized: true
    }));
    
    app.use('/api/accounts', accountRoutes);
    app.use('/api/pets', petRoutes);
    app.use('/api/posts', postRoutes);
    app.use('/api/comments', commentRoutes);
    app.use('/api/ratings', ratingRoutes);

    app.get("/", authorize, function(req, res) {
        res.send("I am working!!!");
    });

    app.get("/login", function(req, res) {
        res.render("login/login");
    })

    app.post("/login", async function(req, res) {
        // Temporary login creds
        const account = await accounts.get(req.body.username);

        if (account && await compareHashPass(req.body.password, account.hashpass)) {
            req.session.AuthCookie = req.body.username;
            res.redirect("/api/accounts");
            
            return;
        }
        else {
            res.render("login/login", {error: "Username of Password is incorrect"});
        }
    })

    app.get("/signup", function(req, res) {
        res.render("signup/signup");
    })

    app.post("/signup", async function(req, res) {
        try {
            // TODO
            // Add addition input forms for Bio, Name. Default picture to null until the user uploads their picture in their profile settings.
            const result = await accounts.create(req.body.username, req.body.password, "1234", "1234", null)
            if (result.accountInserted) {
                // TODO
                // Reder the landing page instead
                res.redirect("/login");
            }
            else {
                res.status(500).render("signup/signup", {error: "Internal server error"});
            }
        }
        catch(e) {
            console.log(e);
            if (e == "Error: user already exists"){
                res.status(400).render("signup/signup", {error: e});
            }
            else {
                res.status(500).render("signup/signup", {error: "Internal server error"})
            }
        }
    })

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;