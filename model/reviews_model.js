const db = require('../db/connection');

exports.selectReviewById = (review_id) => {
    return db.query(`SELECT reviews.*, CAST (COUNT(comments.review_id) AS INTEGER) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = $1 GROUP BY reviews.review_id`, [review_id])
    .then((review) => {
            console.log(review.rows[0]);
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
        if (isNaN(review_id)) {
        return Promise.reject({
            status: 400,
            msg: `Bad request. ${review_id} is not a valid review id`
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
        console.log(review.rows[0])
    return review.rows[0];
    })
}

