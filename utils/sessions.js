const config = require('../configurations/config')
const userSessionModel = require('../models/user.session.model')
const commonService = require('../utils/common')
const constants = require('../utils/constants')

// const generateSessionTokenForAdmin = function (userId, uuid) {
//   return new Promise((resolve, reject) => {
//     const sessionObject = {
//       user_id: userId,
//       login_time: moment().utc().format(),
//       is_logged_out: false,
//       uuid,
//       time_to_leave: moment().utc().toDate().getTime() + config.get('JWT_TOKEN.ttl'),
//       is_otp_verified: false
//     }
//     sqlInstance.sequelize.models.admin_user_session.create(sessionObject).then(() => {
//       logger.info(util.format('Admin User Session Details Stored Successfully User Session Table For User ID: ', userId))
//       jwt.sign({
//         uuid,
//         user_id: userId
//       },
//       config.get('JWT_TOKEN.SECRET'),
//       {
//         algorithm: config.get('JWT_TOKEN.ALGORITHM'),
//         expiresIn: config.get('JWT_TOKEN.expireTime')
//       }, function (error, token) {
//         if (error) {
//           logger.error(util.format('Error while Generating the JWT Token for User ID: ', userId + '. Error: %j', error))
//           reject(error)
//         } else {
//           logger.info(util.format('JWT Token Generated Successfully For User ID: ', userId))
//           resolve(token)
//         }
//       })
//     }).catch((error) => {
//       logger.error(util.format('Error while Storing the Admin User Session Details For User ID: ', userId + '. Error: %j', error))
//       reject(error)
//     })
//   })
// }

const generateSessionTokenForCustomers = async (data) => {
  const sessionObject = {
    userId: data.userId,
    type: constants.sessionType.login,
    loginTime: new Date(),
    isLoggedIn: true,
    ttl: new Date(Date.now() + config.get('JWT_TOKEN.ttl')),
    isActive: true
  }

  const userSession = new userSessionModel(sessionObject)
  await userSession.save()

  const payload = {
    sessionId: userSession._id,
    userId: data.userId
  }

  const token = commonService.signPayload(payload)
  return token.accessToken
}

const generateSessionTokenForAdmin = async (data) => {
  const sessionObject = {
    userId: data.userId,
    type: constants.sessionType.login,
    loginTime: new Date(),
    isLoggedIn: true,
    ttl: new Date(Date.now() + config.get('JWT_TOKEN.ttl')),
    isActive: true,
    isAdmin: true
  }

  const userSession = new userSessionModel(sessionObject)
  await userSession.save()

  const payload = {
    sessionId: userSession._id,
    userId: data.userId
  }

  const token = commonService.signPayload(payload)
  return token.accessToken
}

module.exports = {
  generateSessionTokenForCustomers,
  generateSessionTokenForAdmin
}
