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
    account: getCollectionFn('account'),
    animal: getCollectionFn('animal'),
    post: getCollectionFn('post'),
    comment: getCollectionFn('comment'),
    ratings: getCollectionFn('ratings')
}