const express = require('express');
const { getCategories } = require('./controller/category_controller');

const app = express();
app.use(express.json());

// Get all info on categories currently available
app.get('/api/categories', getCategories);






// Error handler for incorrect url
app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' })
});

// Error handler to return a 400 error (bad request)
app.use((err, req, res, next) => {
    res.status(err.status).send(err.msg)
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