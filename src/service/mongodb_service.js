const mongoose = require('mongoose')
const configuration = require('../configuration/index')
module.exports = {
    init:() => {
        console.log('configuration.getMongoUrl()',configuration.getMongoUrl())
        mongoose.connect(configuration.getMongoUrl(), { useNewUrlParser: true });
    }
}
