const { selectCommentsByReviewId, createComment } = require('../model/comments_model');
const { checkIdExists } = require('../model/utils_model');

exports.getCommentsByReviewId = (req, res, next) => {
    const { review_id } = req.params;

    const promises = [checkIdExists(review_id)];

    if(review_id) {
        promises.push(selectCommentsByReviewId(review_id))
    }
    
    Promise.all(promises)
    .then(( [_, comments] ) => {
// Output of first promise is nothing
            res.status(200).send( comments )
    })
    .catch(next);
}

exports.postComment = (req, res, next) => {
    const { review_id } = req.params;
    const userComment = req.body

    createComment(review_id, userComment)
    .then(comment => {
        res.status(201).send(( {comment} ))
    })
    .catch(next)
}