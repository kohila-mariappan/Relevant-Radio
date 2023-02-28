const userModel = require('../../../models/user.model')
const util = require('util')
const constants = require('../../../utils/constants')
const logger = require('../../../utils/logger')
const bcrypt = require('bcrypt')
const sessionService = require('../../../utils/sessions')
const commonService = require('../../../utils/common')
const userSessionModel = require('../../../models/user.session.model')
const config = require('../../../configurations/config')
const emailService = require('../../../utils/mailer')
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')

/**
 * @description admin api's
 * @module admin - admin
 */
const admin = function () {}

admin.saveAuthUser = async (requestData) => {
  const findUser = await userModel.findOne({ email: requestData.email })
  if (findUser) {
    throw new Error(constants.errorMessage.en.msg_email_exists)
  }
  requestData.firstName = commonService.toPascalCase(requestData.firstName)
  requestData.lastName = commonService.toPascalCase(requestData.lastName)
  requestData.isEmailVerified = true
  const user = new userModel(requestData)
  await user.save()
  return {
    _id: user._id
  }
}

admin.login = async (requestData) => {
  const user = await userModel.findOne({ email: requestData.email, role: 'admin' })
  if (!user) {
    logger.error(util.format(constants.errorMessage.en.msg_email_not_registered))
    throw new Error(constants.errorMessage.en.msg_email_not_registered)
  }

  if (await bcrypt.compare(requestData.password, user.password)) {
    const tokenData = {
      email: user.email,
      userId: user._id.toString()
    }
    const token = await sessionService.generateSessionTokenForAdmin(tokenData)
    user.accessToken = token
    return user
  } else {
    logger.error(util.format(constants.errorMessage.en.msg_password_incorrect))
    throw new Error(constants.errorMessage.en.msg_password_incorrect)
  }
}

admin.forgotPassword = async (requestData) => {
  const user = await userModel.findOne({ email: requestData, role: 'admin' })
  if (!user) {
    logger.error(util.format(constants.errorMessage.en.msg_acoount_not_exists))
    throw new Error(constants.errorMessage.en.msg_acoount_not_exists)
  }

  const uniqueId =
  Date.now().toString(36) + Math.random().toString(36).substring(2)

  const payload = {
    userId: user._id.toString(),
    uuid: uniqueId
  }

  const generateToken = commonService.signPayload(payload)

  if (generateToken) {
    const userSession = new userSessionModel({
      userId: user._id,
      type: constants.sessionType.forgotPassword,
      verificationToken: uniqueId,
      isActive: true,
      isAdmin: true
    })
    await userSession.save()
  }

  const adminResetPasswordBaseUrl = config.get('adminResetPasswordBaseUrl')

  const emailData = {
    recipientMail: requestData,
    mailSubject: 'Forgot Password',
    content: `<h1>Reset your password</h1>
  <h2>Dear Customer,</h2>
  <p>please click on below link to reset your password</p>
  <a href=${adminResetPasswordBaseUrl}?token=${generateToken.accessToken}> reset password link</a>
  </div>`
  }
  const sendMail = emailService.sendMail(emailData)

  if (sendMail) {
    return constants.successMessage.en.msg_password_link_sent
  } else {
    logger.error(util.format(constants.errorMessage.en.msg_email_link_failed))
    throw new Error(constants.errorMessage.en.msg_email_link_failed)
  }
}

admin.resetPassword = async (requestData) => {
  const secretKey = config.get('JWT_TOKEN.SECRET')
  const deToken = jwt.verify(requestData.token, secretKey)
  const userId = deToken.userId

  const user = await userModel.findOne({ _id: userId })

  if (!user) {
    throw new Error(constants.errorMessage.en.msg_user_not_found)
  }
  const session = await userSessionModel.findOne({ userId, isActive: true, type: constants.sessionType.forgotPassword, isAdmin: true }).sort({ _id: -1 })
  if (deToken.uuid === session?.verificationToken) {
    await userSessionModel.findOneAndUpdate(
      { userId: new ObjectId(deToken.userId), isActive: true, type: constants.sessionType.forgotPassword },
      {
        isActive: false,
        updatedAt: new Date(),
        $unset: { verificationToken: 1 }

      }
    )
    const id = new ObjectId(deToken.userId)

    await userModel.updateOne(
      { _id: id },
      {
        password: await bcrypt.hash(requestData.password, 10),
        updatedAt: new Date()
      }
    )
    return constants.successMessage.en.msg_password_reset_success
  } else {
    throw new Error(constants.errorMessage.en.msg_link_invalid)
  }
}

admin.changePassword = async (requestData) => {
  const user = await userModel.findOne({ _id: requestData.userId })

  if (!user) {
    throw new Error(constants.errorMessage.en.msg_user_not_found)
  }

  const areEqual = await bcrypt.compare(requestData.oldPassword, user.password)

  if (!areEqual) {
    throw new Error(constants.errorMessage.en.msg_password_wrong)
  }

  await userModel.updateOne(
    { _id: user._id },
    {
      password: await bcrypt.hash(requestData.newPassword, 10),
      updatedAt: new Date()
    }
  )
  return constants.successMessage.en.msg_password_change
}

admin.logout = async (requestData) => {
  const secretKey = config.get('JWT_TOKEN.SECRET')
  const deToken = jwt.verify(requestData, secretKey)

  const user = await userSessionModel.updateOne({ _id: deToken.sessionId, userId: deToken.userId }, {
    isLoggedIn: false,
    isActive: false,
    logoutTime: new Date(),
    updatedAt: new Date()
  })

  if (user.acknowledged) {
    return constants.successMessage.en.msg_logout
  } else {
    logger.error(util.format(constants.errorMessage.en.msg_session_update_error))
    throw new Error(constants.errorMessage.en.msg_session_update_error)
  }
}

admin.getAllUsers = async (requestData) => {
  const { search, isActive, fromDate, toDate } = requestData

  let page = requestData.page
  const size = requestData.size || 30

  const sort = requestData.sort || 'created_at'
  const order = requestData.order || 'desc'
  const sortOrder = {}

  const query = { role: constants.userRole.user }
  const searchFields = ['firstName', 'lastName', 'email']

  if (search && search.length > 0) {
    const searchList = search.match(/("[^"]+"|[^"\s]+)/g)
    const queryList = []
    searchList.forEach((search) => {
      searchFields.forEach((searchField) => {
        const qry = {}
        qry[searchField] = { $regex: search, $options: 'i' }
        queryList.push(qry)
      })
    })

    query.$or = queryList
  }

  if (isActive && isActive.length > 0) {
    query.isActive = JSON.parse(isActive)
  }

  if (fromDate && toDate) {
    const startDate = new Date(fromDate)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(toDate)
    endDate.setHours(23, 59, 59, 999)
    query.created_at = { $gte: new Date(startDate), $lte: new Date(endDate) }
  }

  if (!page || page <= 0) {
    page = 1
  }

  sortOrder[sort] = order === 'desc' ? -1 : 1

  const start = (page - 1) * size

  const userList = await userModel.aggregate([
    { $match: query },
    { $project: { password: 0, address: 0 } },
    {
      $addFields: {
        formFilled: 0,
        totalDonation: 0
      }
    },
    { $skip: parseInt(start) },
    { $limit: parseInt(size) },
    { $sort: sortOrder }
  ])
  const userCount = await userModel.count(query)
  return { result: userList, totalCount: userCount }
}
admin.loggedInUserList = async (requestData) => {
  let page = requestData.page
  const limit = requestData.limit || 10

  const startDate = new Date(requestData)
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date(requestData)
  endDate.setHours(23, 59, 59, 999)
  if (!page || page <= 0) {
    page = 1
  }
  const start = (page - 1) * limit

  const users = await userSessionModel.aggregate(
    [
      {
        $match: {
          logoutTime: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: '$userId',

          engaggedTime: {
            $sum: {
              $dateDiff: {
                startDate: '$loginTime',
                endDate: '$logoutTime',
                unit: 'hour'
              }
            }
          }
        }

      },
      {
        $lookup: {
          let: {
            userStrId: {
              $toObjectId: '$_id'
            }
          },
          from: 'users',
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    '$_id', '$$userStrId'
                  ]
                },
                role: { $in: ['user'] }
              }
            }
          ],
          as: 'result'
        }
      }, {
        $unwind: {
          path: '$result'
        }
      }, {
        $project: {
          _id: 1,
          firstName: '$result.firstName',
          lastName: '$result.lastName',
          email: '$result.email',
          // role: '$result.role',
          engaggedTime: {
            $trunc: [
              '$engaggedTime', 0
            ]
          }
        }
      },
      { $skip: parseInt(start) },
      { $limit: parseInt(limit) }

    ]

  )

  console.log('users', users)
  return users
}

admin.loggedInUserCount = async (requestData) => {
  const startDate = new Date(requestData)
  startDate.setHours(0, 0, 0)
  const endDate = new Date(requestData)
  endDate.setHours(23, 59, 59)

  const userList = await userSessionModel.aggregate(
    [
      {
        $match: {
          logoutTime: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      }, {
        $group: {
          _id: '$userId',

          engaggedTime: {
            $sum: {
              $dateDiff: {
                startDate: '$loginTime',
                endDate: '$logoutTime',
                unit: 'hour'
              }
            }

          }

        }

      },
      {
        $project:
           {
             _id: 0,
             // fromItems: 0,
             engaggedTime:
                 {
                   $trunc:
                       ['$engaggedTime', 0]
                 }

           }
      }

    ]

  )

  const totalTime = userList.reduce(
    (accumulator, currentValue) => {
      const result = accumulator + currentValue.engaggedTime
      return result
    }, 0)

  // const totalLoggedInUser = await userSessionModel.count({ logoutTime: { $gte: new Date(startDate), $lte: new Date(endDate) } }
  // )
  const count = userList.length

  const avgTime = Math.round(totalTime / count)
  console.log('count', userList.length, 'totaltime', totalTime, 'avgtime', avgTime)
  return {
    count,
    avgTime
  }
}

admin.loggedInUserDetail = async (requestData) => {
  const secretKey = config.get('JWT_TOKEN.SECRET')
  const deToken = jwt.verify(requestData, secretKey)
  const loggedInUser = await userSessionModel.aggregate([
    {
      $match: { $and: [{ userId: deToken.userId, isLoggedIn: false }] }
    }, {
      $group: {
        _id: '$userId',

        engaggedTime: {
          $sum: {
            $dateDiff: {
              startDate: '$loginTime',
              endDate: '$logoutTime',
              unit: 'hour'
            }
          }

        }

      }
    },
    {
      $lookup: {
        let: {
          userStrId: {
            $toObjectId: '$_id'
          }
        },
        from: 'users',
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [
                  '$_id', '$$userStrId'
                ]
              }
            }
          }
        ],
        as: 'result'
      }
    }, {
      $unwind: {
        path: '$result'
      }
    }, {
      $project: {
        _id: 0,
        userDetails: '$result',
        totalEngaggedTime: {
          $trunc: [
            '$engaggedTime', 0
          ]
        }
      }
    }
  ])
  return loggedInUser
}
module.exports = admin
