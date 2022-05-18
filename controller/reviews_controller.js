const { selectReviewById, updateReview } = require('../model/reviews_model');

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;

    if (isNaN(review_id)) {
        return next({
            status: 400,
            msg: `Bad request. ${review_id} is not a valid review id`
        })
    }
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
    const {review_id} = req.params;
    const {inc_votes} = req.body

    if (isNaN(review_id)) {
        return next({
            status: 400,
            msg: `Bad request. ${review_id} is not a valid review id`
        })
    }
    updateReview (review_id, inc_votes)
    .then((review) => {
        res.status(200).send({ review });
    })
    .catch((err) => {
        next(err);
    })
}

