/* eslint-disable n/handle-callback-err */
/* eslint-disable n/no-callback-literal */
const config = require('../configurations/config')
const jwt = require('jsonwebtoken')
const constants = require('../utils/constants')
const userSessionModel = require('../models/user.session.model')
const userModel = require('../models/user.model')

module.exports = {
  verifyToken: function (req, res, next) {
    if (req.path === '/verify-email') {
      req.headers.usertype = 'user'
    }
    if (req.headers.usertype !== undefined && req.headers.usertype.toLowerCase() === 'user') {
      if (req.headers.authorization && constants.publicAPIForCustomers.indexOf(req.path) < 0) {
        const token = req.headers.authorization
        const userId = (jwt.decode(token)) ? jwt.decode(token).userId : ''
        // Function Call To Check that Whether the User is a valid User Or not
        checkValidTokenForUsers(token, userId, req, next)
      } else {
        if (constants.publicAPIForCustomers.indexOf(req.path) >= 0) {
          req.isAuthenticatedUser = true
          next()
        } else {
          req.isAuthenticatedUser = false
          next()
        }
      }
    } else if (req.headers.usertype !== undefined && req.headers.usertype.toLowerCase() === 'admin') {
      if (req.headers.authorization && constants.publicAPIForAdmin.indexOf(req.path) < 0) {
        const token = req.headers.authorization
        const userId = (jwt.decode(token)) ? jwt.decode(token).userId : ''
        // Function Call To Check that Whether the Admin is a valid User Or not
        checkValidTokenForAdmin(token, userId, req, next)
      } else {
        if (constants.publicAPIForAdmin.indexOf(req.path) >= 0) {
          req.isAuthenticatedUser = true
          next()
        } else {
          req.isAuthenticatedUser = false
          next()
        }
      }
    } else {
      req.isAuthenticatedUser = false
      next()
    }
  }
}

const checkValidTokenForUsers = function (token, userId, req, next) {
  if (token) {
    verifyTokenForUsers(token, async function (error, status) {
      if (status === constants.httpStatusCode.success) {
        await userModel.findOne({
          _id: userId,
          isActive: true,
          role: constants.userRole.user
        }).then((userDetails) => {
          if (userDetails !== null) {
            req.isAuthenticatedUser = true
            req.user = userDetails
            next()
          } else {
            req.isAuthenticatedUser = false
            next()
          }
        })
      } else {
        req.isAuthenticatedUser = false
        next()
      }
    })
  } else {
    req.isAuthenticatedUser = false
    next()
  }
}

const checkValidTokenForAdmin = function (token, userId, req, next) {
  if (token) {
    verifyTokenForUsers(token, async function (error, status) {
      if (status === constants.httpStatusCode.success) {
        await userModel.findOne({
          _id: userId,
          isActive: true,
          role: constants.userRole.admin
        }).then((userDetails) => {
          if (userDetails !== null) {
            req.isAuthenticatedUser = true
            req.user = userDetails
            next()
          } else {
            req.isAuthenticatedUser = false
            next()
          }
        })
      } else {
        req.isAuthenticatedUser = false
        next()
      }
    })
  } else {
    req.isAuthenticatedUser = false
    next()
  }
}

const verifyTokenForUsers = function (token, cb) {
  if (token) {
    // if it's a JWT token and if we have decoded it
    // verify it with the signing password(from config)
    jwt.verify(token, config.get('JWT_TOKEN.SECRET'), async function (error, decoded) {
      if (error) {
        const errorMessage = 'Token Expired, Please login again'
        cb(errorMessage, constants.httpStatusCode.badRequest)
      } else {
        console.log('dec', decoded)
        await userSessionModel.findOne({
          _id: decoded.sessionId,
          userId: decoded.userId,
          type: constants.sessionType.login,
          isLoggedIn: true
        }).then((sessionDetails) => {
          if (sessionDetails) {
            if (sessionDetails.ttl > new Date() && sessionDetails.isLoggedIn === true) {
              cb(null, constants.httpStatusCode.success)
            } else {
              cb('Session Expired...!!', constants.httpStatusCode.forbidden)
            }
          } else {
            cb('Invalid Token, Please login again', constants.httpStatusCode.forbidden)
          }
        }).catch((error) => {
          const errorMessage = 'Cannot Find User Session Details In User Session Table'
          cb(errorMessage, constants.httpStatusCode.badRequest)
        })
      }
    })
  } else {
    cb('Invalid token, please login again.', constants.httpStatusCode.badRequest)
  }
}
