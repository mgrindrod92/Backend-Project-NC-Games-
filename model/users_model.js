const db = require('../db/listen');

exports.selectUsers = () => {
    return db.query('SELECT * FROM users')
    .then(users => {
        return users.rows;
    })
}