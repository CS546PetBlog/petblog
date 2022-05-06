const accountRoutes = require('./accounts');
const petRoutes = require('./pets');
const postRoutes = require('./posts');
const commentRoutes = require('./comments');
const ratingRoutes = require('./ratings');

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
        const tempAdminUsername = "admin";

        // Password is password123
        const tempAdminPasswordHash = "$2a$10$s54DPjUOd6KCqANHCo2bEOVvz7fhOSGWb5WYMxlYn6b1ZSZ/kyn3.";

        if (tempAdminUsername == req.body.username && await compareHashPass(req.body.password, tempAdminPasswordHash)) {
            req.session.AuthCookie = req.body.username;
            res.redirect("/api/accounts");
          
            return;
        }
        else {
            res.redirect("/login")
        }
    })

    app.get("/signup", function(req, res) {
        res.render("signup/signup");
    })

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;