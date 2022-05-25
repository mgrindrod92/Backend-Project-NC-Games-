const db = require('../db/listen');

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories').then(result => {
    return result.rows;
    })   
}