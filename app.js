const express = require('express');
const { getCategories } = require('./controller/category_controller');
const { getReviewById, patchReview, getReviews } = require('./controller/reviews_controller');
const { getUsers } = require('./controller/users_controller');
const { getCommentsByReviewId, postComment, deleteCommentById } = require('./controller/comments_controller');
const { getAPI } = require('./controller/api_controller');

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

// TASK 8 - Get all reviews (including comment_count)
app.get('/api/reviews', getReviews);

// TASK 9 - Get all comments for a specific review
app.get('/api/reviews/:review_id/comments', getCommentsByReviewId)

// TASK 10 - Post a new comment
app.post('/api/reviews/:review_id/comments', postComment)

// TASK 12 - Delete a comment
app.delete('/api/comments/:comment_id', deleteCommentById)

// TASK 13 - Get API
app.get('/api', getAPI)

// 404 error
app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' })
})

// Error handler for errors in Postgres
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid input' })
    }
    if (err.code === '23503') {
        res.status(404).send({ msg: 'Resource not found' })
    }
    next(err);
})

// Error handler
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    }
    next(err);
})

// Final error handler
app.use((err, req, res, next) => {
    res.status(500).send('Server Error')
});

// let PORT = process.env.PORT;
// if (PORT === null || PORT === "") {
//     PORT = 5678
// }

module.exports = app;