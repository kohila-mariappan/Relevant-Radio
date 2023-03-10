const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')
const noCache = require('nocache')
const util = require('util')
const config = require('../configurations/config')
const logger = require('../utils/logger')
const constants = require('../utils/constants')
const verifier = require('../middlewares/sessionMiddleware')

module.exports = function (app) {
  // To catch uncaught exception and give an appropriate response to the user
  app.use(function (err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    logger.error(util.format('Uncaught exception caught, error:- %j', err))
    return res.status(constants.httpStatusCode.success).send({
      code: constants.responseCodes.failedOperation,
      message: constants.messageKeys.en.msg_failed,
      data: {}
    })
  })

  // Enable http logging
  if (config.get('server.enableHttpLogging')) { app.use(logger.startHttpLogger()) }

  // Enable compression
  if (config.get('server.enableCompression')) { app.use(compression()) }

  // Prevent opening page in frame or iframe to protect from clickjacking
  if (config.get('server.security.enableXframe')) { app.use(helmet.frameguard()) }

  // Remove X-Powered-By
  if (config.get('server.security.enableHidePoweredBy')) { app.use(helmet.hidePoweredBy()) }

  // Prevent browser from caching and storing page
  if (config.get('server.security.enableNoCaching')) { app.use(noCache()) }

  // Allow loading resources only from white-listed domains
  if (config.get('server.security.enableCSP')) { app.use(helmet.csp()) }

  // Allow communication only on HTTPS
  if (config.get('server.security.enableHSTS')) { app.use(helmet.hsts()) }

  // Enable XSS filter in IE (On by default)
  if (config.get('server.security.enableXssFilter')) { app.use(helmet.xssFilter()) }

  // Forces browser to only use the Content-Type set in the response header
  // instead of sniffing or guessing it
  if (config.get('server.security.enableForceContentType')) { app.use(helmet.contentTypeOptions()) }

  // Enable request body parsing
  app.use(bodyParser.urlencoded({
    extended: true
    // limit: config.get('server.bodyParser.limit')
  }))

  // Enable request body parsing in JSON format
  app.use(bodyParser.json({
    // limit: config.get('server.bodyParser.limit')
  }))

  // verify session token
  app.use(verifier.verifyToken, function (req, res, next) {
    if (req.isAuthenticatedUser) {
      next()
    } else {
      return res.status(constants.httpStatusCode.success).send({
        code: constants.responseCodes.unauthorizedAccess,
        message: constants.messageKeys.en.msg_unauthorized_user
      })
    }
  })

  // Enable request logger
  require('./requestLog')(app)
}
