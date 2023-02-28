const common = require('../../../utils/common')
const constants = require('../../../utils/constants')
const schemas = require('./user-schema')
const user = require('./user-model')

/**
 * @method userOnBoardAPI
 * @description  user login
 * @module user - user
 */

const saveUser = async function (req, res) {
  try {
    const data = common.sanitize(req.body, schemas.saveUser, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.saveUser)) {
      const status = await user.saveUser(req.body)
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

const emailVerify = async function (req, res) {
  try {
    const data = common.sanitize(req.query, schemas.emailVerify, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.emailVerify)) {
      const status = await user.emailVerify(req.query.token)
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

const login = async function (req, res) {
  try {
    const data = common.sanitize(req.body, schemas.login, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.login)) {
      const decryptData = common.decryptData(req.body.data)
      const status = await user.login(decryptData)
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
      const status = await user.forgotPassword(req.body.email)
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
      const status = await user.resetPassword(verificationData)
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
    const data = common.sanitize(req.body, schemas.changePassword, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.changePassword)) {
      const status = await user.changePassword(requestData)
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
    const status = await user.logout(req.headers.authorization)
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

const saveAddress = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id
    requestData.address = req.body
    const data = common.sanitize(req.body, schemas.saveAddress, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.saveAddress)) {
      const status = await user.saveAddress(requestData)
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

const updateAddress = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id
    requestData.addressId = req.query.id
    requestData.address = req.body
    const data = common.sanitize(req.body, schemas.updateAddress, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.updateAddress)) {
      const status = await user.updateAddress(requestData)
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

const deleteAddress = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id
    requestData.addressId = req.query.id
    const status = await user.deleteAddress(requestData)
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
const getAllAddress = async function (req, res) {
  try {
    const status = await user.getAllAddress(req)
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

const encryptBody = async function (req, res) {
  try {
    const status = await user.encryptBody(JSON.stringify(req.body))
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

const updateProfile = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id
    requestData.data = req.body
    const data = common.sanitize(req.body, schemas.updateProfile, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.updateProfile)) {
      const status = await user.updateProfile(requestData)
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

const getProfile = async function (req, res) {
  try {
    const status = await user.getProfile(req)
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

const sendEmailVerificationLink = async function (req, res) {
  try {
    const data = common.sanitize(req.body, schemas.sendVerificationLink, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.sendVerificationLink)) {
      const status = await user.sendEmailVerificationLink(req.body)
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

module.exports = {
  saveUser,
  emailVerify,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
  encryptBody,
  updateProfile,
  getProfile,
  saveAddress,
  updateAddress,
  deleteAddress,
  getAllAddress,
  sendEmailVerificationLink
}
