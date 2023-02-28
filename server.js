const express = require('express')
const util = require('util')
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./configurations/config')
const routes = require('./routes/index')
const middlewares = require('./middlewares/index')
const mongoDbConnect = require('./database/mongoConnection')

const app = express()

// use cors
app.use(cors())

// required to get client IP when running via reverse proxy (HA proxy)
app.set('trust proxy', true)

// service health check
app.get('/ping', (req, res) => {
  res.json({ message: 'Welcome to relevant radio API.' })
})

// setup middlewares
middlewares(app)

// setup routes
routes(app)

// db connection
mongoDbConnect()

app.listen(process.env.PORT || config.get('server.port'), function () {
  logger.info(util.format('Relevant Radio API Service with pid: %s listening on port: %s', process.pid, config.get('server.port')))
  logger.info(util.format('Environment: %s', config.get('env')))
})

app.timeout = config.get('server.timeout')

process.on('uncaughtException', function (e) {
  logger.error(util.format('uncaught exception:- ', e.stack))
})
