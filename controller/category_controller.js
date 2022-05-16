const { selectCategories, selectReviewById } = require('../model/category_model');

exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send( {categories} )
    })

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    console.log(req.params);
    selectReviewById(review_id).then((review) => {
        console.log(req.body);
        console.log(review);
        res.status(200).send({ review })
    })
};
    
}