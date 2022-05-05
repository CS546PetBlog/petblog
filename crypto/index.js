const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const genHashPassword = async function(password) {
    return new Promise(function(res, rej) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                res(hash);
            });
        });
    });
}

// const genSalt = async function() {
//     return new Promise(function(res, rej) {
//         bcrypt.genSalt(10, function(err, salt) {
//             if (err) {
//                 rej(err);
//             }
//             else {
//                 res(salt)
//             }
//         });
//     })
// }

const compareHashPass = async function(pass, hashpass) {
    return await bcrypt.compare(pass, hashpass);
}

const genRandomPassword = function() {
    return crypto.randomBytes(20).toString('hex');
}

module.exports = {
    genHashPassword,
    compareHashPass,
    genRandomPassword
}