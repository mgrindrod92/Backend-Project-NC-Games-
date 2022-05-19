const express = require('express');
const { getCategories } = require('./controller/category_controller');
const { getReviewById, patchReview } = require('./controller/reviews_controller');
const { getUsers } = require('./controller/users_controller');

const app = express();
app.use(express.json());

// TASK 3 - Get all info on categories currently available
app.get('/api/categories', getCategories);

// TASK 4 - Get information for a specific review
// TASK 7 - Get all comments for a specific reviewm,
app.get('/api/reviews/:review_id', getReviewById)

// TASK 5 - For a specific review increase/decrease the review's vote value
app.patch('/api/reviews/:review_id', patchReview)

// TASK 6 - Get all information on users currently available
app.get('/api/users', getUsers);

// 404 error
app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' })
})

// Error handler for errors in Postgres
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid input' })
    }
    next(err);
})

// Error handler
app.use((err, req, res, next) => {
    if(err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg })
    }
    next(err);
})

// final error handler
app.use((err, req, res, next) => {
res.status(500).send('Server Error')
});

// // Testing with Insomnia
// app.listen(9801, (err) => {
//     if (err) console.log(err);
//     else console.log(`Listening on port 9801...`);
// })

module.exports = app;