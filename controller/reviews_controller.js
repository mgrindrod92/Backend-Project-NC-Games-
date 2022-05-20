const { selectReviewById, updateReview, selectReviews, selectCommentsByReviewId } = require('../model/reviews_model');

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;

    selectReviewById(review_id)
        .then((review) => {
            if (!review) {
                return Promise.reject({
                    status: 404,
                    msg: `Not found. This review does not exist`
                });
            } else {
                res.status(200).send({ review })
            }
        })
        .catch(next);
};

exports.patchReview = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body

    updateReview(review_id, inc_votes)
        .then((review) => {
            res.status(200).send({ review });
        })
        .catch((err) => {
            next(err);
        })
}

exports.getReviews = (req, res, next) => {
    const { sort_by, order, category } = req.query;
    selectReviews(sort_by, order, category)
        .then((reviews) => {
                if (reviews.length === 0) {
        return Promise.reject({
            status: 404,
            msg: `Invalid input`
        })
    }
            res.status(200).send({ reviews })
    })
    .catch (next);
    }

