let { ObjectId } = require('mongodb');

const validString = function(str) {
    if (str == null) {
        return false;
    }

    if (typeof str != "string") {
        return false;
    }

    if (str.length == 0) {
        return false;
    }

    if (str.trim().length == 0) {
        return false;
    }

    return true;
}

const validID = function(id) {
    if (!validString(id)) {
        return false;
    }

    if (!ObjectId.isValid(id)) {
        return false;
    }

    return true;
}

const validInt = function(n) {
    if (n == null) {
        return false
    }

    if (!Number.isInteger(n)) {
        return false;
    }

    return true;
}

const validZip = function(zip) {
    if (zip == null) {
        return false;
    }

    if (typeof zip != "string") {
        return false;
    }

    if (zip.length != 5) {
        return false;
    }

    for (var i = 0; i < zip.length; i++) {
        if (isNaN(parseInt(zip[i]))) {
            return false;
        }
    }
    return true;
}

module.exports = {validString, validID, validInt, validZip};