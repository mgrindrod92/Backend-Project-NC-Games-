const db = require('../db/connection');

exports.checkIdExists = (review_id) => {
    return db.query
    (`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then((review) => {
        if (review.rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: `Route not found`
            })
               }
    })
}

// // Check reviews table to see if review_id exists
// const checkIdExists = async('reviews', 'review_id', review_id)

// // Check users table to see if username exists
// const checkUsernameExists = async('users', 'username', userData.username)