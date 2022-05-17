const { selectCategories } = require('../model/category_model');

exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send( {categories} )
    })
}
