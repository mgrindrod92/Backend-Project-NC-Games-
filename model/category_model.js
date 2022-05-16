const db = require('../db/connection');

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories').then(result => {
    return result.rows;
    })   
}

exports.selectReviewById = (review_id) => {
    return db.query('SELECT * from reviews WHERE review_id = ${review_id}')
    .then((review) => {
        console.log(review.rows);
        return review.rows;
    })
}