const { fetchAPI } = require('../model/api_model')

exports.getAPI = (req, res, next) => {
    fetchAPI()
    .then( data => {
        res.status(200).send( {data } )
    })
    .catch(next);
}