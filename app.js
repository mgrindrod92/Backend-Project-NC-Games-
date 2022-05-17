const express = require('express');
const { getCategories } = require('./controller/category_controller');
const { getReviewById, patchReview } = require('./controller/reviews_controller');

const app = express();
// app.use(express.json());

// Get all info on categories currently available
app.get('/api/categories', getCategories);

// Get information for a specific review
app.get('/api/reviews/:review_id', getReviewById)

// For a specific review increase/decrease the review's vote value
// app.patch('api/reviews/:review_id', patchReview)

// Error handler
app.use((err, req, res, next) => {
    if(err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg })
    }
    res.status(500).send('Server Error')
})

// // final error handler
// app.use((err, req, res, next) => {
// res.status(500).send('Server Error')
// });

// // Testing with Insomnia
// app.listen(9801, (err) => {
//     if (err) console.log(err);
//     else console.log(`Listening on port 9801...`);
// })

module.exports = app;