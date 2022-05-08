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

module.exports = {validString, validID};