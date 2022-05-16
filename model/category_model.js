const db = require('../db/connection');

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories').then(result => {
    console.log(result.rows);    
    return result.rows;
    })   
}