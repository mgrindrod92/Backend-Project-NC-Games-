const db = require('../db/listen');
const { userData } = require('../db/data/test-data');

exports.selectCommentsByReviewId = (review_id) => {
    return db.query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id])
    .then((comments) => {
        return comments.rows;
    })
}

exports.createComment = (review_id, userData) => {

        if(!userData.username || !userData.body) {
            return Promise.reject ({
                status: 400,
                msg: 'Invalid input'
            })
        }

        return db.query(`INSERT INTO comments
        (author, body, review_id)
        VALUES
        ('${userData.username}', '${userData.body}', '${review_id}')
        RETURNING *;
        `)
        .then((comment) => {
        return comment.rows[0]
        })
}

exports.removeCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then((comment) => {
        return comment.rows[0];
    })
} 

exports.selectCommentById = (comment_id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then((comment) => {
        return comment.rows[0];
    })
}