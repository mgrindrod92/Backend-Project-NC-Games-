const db = require('../db/connection');

exports.selectReviewById = (review_id) => {
    return db.query(`SELECT reviews.*, CAST (COUNT(comments.review_id) AS INTEGER) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = $1 GROUP BY reviews.review_id`, [review_id])
    .then((review) => {
            return review.rows[0];
        })
}

exports.updateReview = (review_id, votes) => {

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
    return review.rows[0];
    })
}

