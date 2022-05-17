const db = require('../db/connection');

exports.selectReviewById = (review_id) => {
    return db.query('SELECT * FROM reviews WHERE review_id = $1', [review_id])
    .then((review) => {
        return review.rows[0];
    })
}

/*

exports.updateReview = (review_id, votes) => {
    if(typeof votes !== 'number' && votes !== undefined) {
        return Promise.reject(({
            status: 400,
            msg: `The inc_votes value: '${votes}' is not a valid input,
        });
        )
        let newVotes = votes;
        if (votes === undefined) {
            newVotes = 0;
            return db.query
            (`UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;',
            [newVotes, review_id])
            .then(result.rows.length === 0) {
                return Promise.reject({
                    status: 400,
                    msg: `No review found with the review_id: ${review_id}`
                })
            }
            return result.rows[0];
    }
}

*/
