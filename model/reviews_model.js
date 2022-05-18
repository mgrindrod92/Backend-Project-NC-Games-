const db = require('../db/connection');

exports.selectReviewById = (review_id) => {
    return db.query('SELECT * FROM reviews WHERE review_id = $1', [review_id])
        .then((review) => {
            return review.rows[0];
        })
}

exports.updateReview = (review_id, votes) => {
    if (typeof votes !== 'number' && votes !== undefined) {
        return Promise.reject({
            status: 400,
            msg: 'The vote value provided is not valid',
        })
    }
        return db.query
            (`UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
                [votes, review_id])
                .then((review) => {
            if (review.rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: `No review found with this review id`
            })
        }
    return review.rows;
    })
}

