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

module.exports = {validString};