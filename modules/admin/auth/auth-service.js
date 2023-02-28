const common = require('../../../utils/common')
const constants = require('../../../utils/constants')
const schemas = require('./auth-schema')
const admin = require('./auth-model')
const moment = require('moment')

/**
 * @method adminOnBoardAPI
 * @description  admin login
 * @module admin - admin
 */

const saveAuthUser = async function (req, res) {
  try {
    const data = common.sanitize(req.body, schemas.saveAuthUser, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.saveAuthUser)) {
      const status = await admin.saveAuthUser(req.body)
      res.status(constants.httpStatusCode.success).send({
        code: constants.responseCodes.successfulOperation,
        message: constants.messageKeys.en.msg_success,
        data: status
      })
    } else {
      res.status(constants.httpStatusCode.badRequest).send({
        code: constants.responseCodes.revalidation,
        message: constants.messageKeys.en.msg_revalidate
      })
    }
  } catch (error) {
    res.status(constants.httpStatusCode.failedOperation).send({
      code: constants.responseCodes.failedOperation,
      message: error.message,
      data: false
    })
  }
}

const login = async function (req, res) {
  try {
    const data = common.sanitize(req.body, schemas.login, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.login)) {
      const decryptData = common.decryptData(req.body.data)
      console.log(decryptData)
      const status = await admin.login(decryptData)
      res.status(constants.httpStatusCode.success).send({
        code: constants.responseCodes.successfulOperation,
        message: constants.messageKeys.en.msg_success,
        data: status
      })
    } else {
      res.status(constants.httpStatusCode.badRequest).send({
        code: constants.responseCodes.revalidation,
        message: constants.messageKeys.en.msg_revalidate
      })
    }

    // if (schemas.validate(data, schemas.login)) {
    //   const status = await user.login(req.body)
    //   res.status(constants.httpStatusCode.success).send({
    //     code: constants.responseCodes.successfulOperation,
    //     message: constants.messageKeys.en.msg_success,
    //     data: status
    //   })
    // } else {
    //   res.status(constants.httpStatusCode.badRequest).send({
    //     code: constants.responseCodes.revalidation,
    //     message: constants.messageKeys.en.msg_revalidate
    //   })
    // }
  } catch (error) {
    res.status(constants.httpStatusCode.failedOperation).send({
      code: constants.responseCodes.failedOperation,
      message: error.message,
      data: false
    })
  }
}

const forgotPassword = async function (req, res) {
  try {
    const data = common.sanitize(req.body, schemas.forgotPassword, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.forgotPassword)) {
      const status = await admin.forgotPassword(req.body.email)
      res.status(constants.httpStatusCode.success).send({
        code: constants.responseCodes.successfulOperation,
        message: status,
        data: []
      })
    } else {
      res.status(constants.httpStatusCode.badRequest).send({
        code: constants.responseCodes.revalidation,
        message: constants.messageKeys.en.msg_revalidate
      })
    }
  } catch (error) {
    res.status(constants.httpStatusCode.failedOperation).send({
      code: constants.responseCodes.failedOperation,
      message: error.message,
      data: false
    })
  }
}

const resetPassword = async function (req, res) {
  try {
    const decrypt = common.decryptData(req.body.data)
    const verificationData = {}
    verificationData.token = req.query.token
    verificationData.password = decrypt.password
    const data = common.sanitize(verificationData, schemas.resetPassword, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.resetPassword)) {
      const status = await admin.resetPassword(verificationData)
      res.status(constants.httpStatusCode.success).send({
        code: constants.responseCodes.successfulOperation,
        message: status,
        data: []
      })
    } else {
      res.status(constants.httpStatusCode.badRequest).send({
        code: constants.responseCodes.revalidation,
        message: constants.messageKeys.en.msg_revalidate
      })
    }
  } catch (error) {
    res.status(constants.httpStatusCode.failedOperation).send({
      code: constants.responseCodes.failedOperation,
      message: error.message,
      data: false
    })
  }
}

const changePassword = async function (req, res) {
  try {
    const decrypt = common.decryptData(req.body.data)
    const requestData = {}
    requestData.userId = req.user._id
    requestData.oldPassword = decrypt.oldPassword
    requestData.newPassword = decrypt.newPassword
    console.log(requestData)
    const data = common.sanitize(req.body, schemas.changePassword, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.changePassword)) {
      const status = await admin.changePassword(requestData)
      res.status(constants.httpStatusCode.success).send({
        code: constants.responseCodes.successfulOperation,
        message: status,
        data: []
      })
    } else {
      res.status(constants.httpStatusCode.badRequest).send({
        code: constants.responseCodes.revalidation,
        message: constants.messageKeys.en.msg_revalidate
      })
    }
  } catch (error) {
    res.status(constants.httpStatusCode.failedOperation).send({
      code: constants.responseCodes.failedOperation,
      message: error.message,
      data: false
    })
  }
}

const logout = async function (req, res) {
  try {
    const status = await admin.logout(req.headers.authorization)
    res.status(constants.httpStatusCode.success).send({
      code: constants.responseCodes.successfulOperation,
      message: status,
      data: []
    })
  } catch (error) {
    res.status(constants.httpStatusCode.failedOperation).send({
      code: constants.responseCodes.failedOperation,
      message: error.message,
      data: false
    })
  }
}

const getAllUsers = async function (req, res) {
  try {
    const status = await admin.getAllUsers(req.query)
    res.status(constants.httpStatusCode.success).send({
      code: constants.responseCodes.successfulOperation,
      message: constants.messageKeys.en.msg_success,
      data: status
    })
  } catch (error) {
    res.status(constants.httpStatusCode.failedOperation).send({
      code: constants.responseCodes.failedOperation,
      message: error.message,
      data: false
    })
  }
}
const loggedInUserList = async function (req, res) {
  try {
    const changeddate = moment().subtract({ day: 1 }).format('YYYY-MM-DD')
    console.log('changeddate', changeddate)
    const date = req.query.date == null ? changeddate : req.query.date

    const data = common.sanitize(date, schemas.getLogedInUserList, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.getLogedInUserList)) {
      const status = await admin.loggedInUserList(date)
      res.status(constants.httpStatusCode.success).send({
        code: constants.responseCodes.successfulOperation,
        message: constants.messageKeys.en.msg_success,
        data: status
      })
    } else {
      res.status(constants.httpStatusCode.badRequest).send({
        code: constants.responseCodes.revalidation,
        message: constants.messageKeys.en.msg_revalidate
      })
    }
  } catch (error) {
    res.status(constants.httpStatusCode.failedOperation).send({
      code: constants.responseCodes.failedOperation,
      message: error.message,
      data: false
    })
  }
}

const loggedInUserCount = async function (req, res) {
  try {
    const changeddate = moment().subtract({ day: 1 }).format('YYYY-MM-DD')
    console.log('changeddate', changeddate)
    const date = req.query.date == null ? changeddate : req.query.date

    const data = common.sanitize(date, schemas.getLogedInUserCount, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.getLogedInUserCount)) {
      const status = await admin.loggedInUserCount(date)
      res.status(constants.httpStatusCode.success).send({
        code: constants.responseCodes.successfulOperation,
        message: constants.messageKeys.en.msg_success,
        data: status
      })
    } else {
      res.status(constants.httpStatusCode.badRequest).send({
        code: constants.responseCodes.revalidation,
        message: constants.messageKeys.en.msg_revalidate
      })
    }
  } catch (error) {
    res.status(constants.httpStatusCode.failedOperation).send({
      code: constants.responseCodes.failedOperation,
      message: error.message,
      data: false
    })
  }
}

const getLoginUserDetail = async function (req, res) {
  try {
    const status = await admin.loggedInUserDetail(req.headers.authorization)
    res.status(constants.httpStatusCode.success).send({
      code: constants.responseCodes.successfulOperation,
      message: constants.messageKeys.en.msg_success,
      data: status
    })
  } catch (error) {
    res.status(constants.httpStatusCode.failedOperation).send({
      code: constants.responseCodes.failedOperation,
      message: error.message,
      data: false
    })
  }
}

module.exports = {
  saveAuthUser,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
  getAllUsers,
  loggedInUserList,
  loggedInUserCount,
  getLoginUserDetail
}
