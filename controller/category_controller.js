const { selectCategories } = require('../model/category_model');

exports.getCategories = (req, res, next) => {

    selectCategories()
    .then((categories) => {
        // if (categories.length === 0) {
        //     return Promise.reject({
        //         status: 404,
        //         msg: `No categories found`
        //     });
        // } else {
            res.status(200).send({ categories })
    })
}