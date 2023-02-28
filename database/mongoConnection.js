const config = require('../configurations/config')
const mongoose = require('mongoose')
const logger = require('../utils/logger')

const mongoDbConnect = function async () {
  mongoose.set('strictQuery', false)
  mongoose
    .connect(config.get('mongo.url'), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      logger.info('Connected to the database!')
    })
    .catch((err) => {
      logger.info('Cannot connect to the database!', err)
      process.exit()
    })
}

module.exports = mongoDbConnect
