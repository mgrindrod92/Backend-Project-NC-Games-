const app = require('./app');

const { PORT = 9090 } = process.env;

// Testing with Insomnia
app.listen(PORT, (err) => {
    if (err) throw (err);
    console.log(`Listening on port ${PORT}...`);
})

module.exports = app;