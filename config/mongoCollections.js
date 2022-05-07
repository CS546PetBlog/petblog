const dbConnection = require('./mongoConnection');

const getCollectionFn = (collection) => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
};

module.exports = {
    accounts: getCollectionFn('account'),
    pets: getCollectionFn('pet'),
    posts: getCollectionFn('post'),
    comments: getCollectionFn('comment'),
    ratings: getCollectionFn('ratings')
}