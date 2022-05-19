const { selectCommentsByReviewId } = require('../model/comments_model');
const { checkExists } = require('../model/utils_model');

exports.getCommentsByReviewId = (req, res, next) => {
    const { review_id } = req.params;

    const promises = [checkExists(review_id)];

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