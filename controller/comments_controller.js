const { selectCommentsByReviewId, createComment, selectCommentById, removeCommentById } = require('../model/comments_model');
const { checkIdExists } = require('../model/utils_model');

exports.getCommentsByReviewId = (req, res, next) => {
    const { review_id } = req.params;

    const promises = [checkIdExists(review_id)];

    if (review_id) {
        promises.push(selectCommentsByReviewId(review_id))
    }

    Promise.all(promises)
        .then(([_, comments]) => {
            // Output of first promise is nothing
            res.status(200).send(comments)
        })
        .catch(next);
}

exports.postComment = (req, res, next) => {
    const { review_id } = req.params;
    const userComment = req.body

    createComment(review_id, userComment)
        .then(comment => {
            res.status(201).send(({ comment }))
        })
        .catch(next)
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params

            if (isNaN(comment_id)) {
                return next({
                    status: 400,
                    msg: `Invalid Comment ID!`,
                });
            }
            selectCommentById(comment_id)
                .then((comment) => {
                    if (!comment) {
                        return Promise.reject({
                            status: 404,
                            msg: `This comment doesn't exist`,
                        })
                    }
                    return comment
                })
                .then(() => {
                    removeCommentById(comment_id).then(() => {
                        res.status(204).send();
                    })
                })
                .catch(next);
            }