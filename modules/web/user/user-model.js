const util = require('util')
const logger = require('../../../utils/logger')
const userModel = require('../../../models/user.model')
const userSessionModel = require('../../../models/user.session.model')
const emailService = require('../../../utils/mailer')
const commonService = require('../../../utils/common')
const config = require('../../../configurations/config')
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')
const bcrypt = require('bcrypt')
const sessionService = require('../../../utils/sessions')
const constants = require('../../../utils/constants')
const { v4: uuidv4 } = require('uuid')
const CryptoJS = require('crypto-js')

/**
 * @description user api's
 * @module user - user
 */
const user = function () {}

user.saveUser = async (requestData) => {
  const findUser = await userModel.findOne({ email: requestData.email })
  if (findUser) {
    throw new Error(constants.errorMessage.en.msg_email_exists)
  }

  requestData.firstName = commonService.toPascalCase(requestData.firstName)
  requestData.lastName = commonService.toPascalCase(requestData.lastName)
  const user = new userModel(requestData)
  await user.save()

  await emailService.sendEmailVerificationLink(user.email)
  return {
    _id: user._id
  }
}

user.sendEmailVerificationLink = async (requestData) => {
  await emailService.sendEmailVerificationLink(requestData.email)
  return constants.successMessage.en.msg_email_verification_link
}

user.emailVerify = async (requestData) => {
  const secretKey = config.get('JWT_TOKEN.SECRET')
  const deToken = jwt.verify(requestData, secretKey)
  const userId = deToken.userId

  const user = await userModel.findOne({ _id: userId })

  if (user?.isEmailVerified) {
    throw new Error(constants.errorMessage.en.msg_email_verification)
  }
  const findUser = await userSessionModel.findOne({ userId, isActive: true, type: constants.sessionType.emailVerification })
  if (deToken.uuid === findUser?.verificationToken) {
    await userSessionModel.findOneAndUpdate(
      { userId: new ObjectId(deToken.userId) },
      {
        isActive: false,
        updatedAt: new Date(),
        $unset: { verificationToken: 1 }

      }
    )
    const id = new ObjectId(deToken.userId)

    await userModel.findOneAndUpdate(
      { _id: id },
      {
        isEmailVerified: true,
        updatedAt: new Date()
      }
    )
    return constants.successMessage.en.msg_email_verified
  } else {
    throw new Error(constants.errorMessage.en.msg_link_invalid)
  }
}

user.login = async (requestData) => {
  const user = await userModel.findOne({ email: requestData.email, role: constants.userRole.user })
  if (!user) {
    logger.error(util.format(constants.errorMessage.en.msg_email_not_registered))
    throw new Error(constants.errorMessage.en.msg_email_not_registered)
  }
  if (user.isEmailVerified === false) {
    logger.error(util.format(constants.errorMessage.en.msg_email_not_verified))
    throw new Error(constants.errorMessage.en.msg_email_not_verified)
  }
  if (await bcrypt.compare(requestData.password, user.password)) {
    const tokenData = {
      email: user.email,
      userId: user._id.toString()
    }
    const token = await sessionService.generateSessionTokenForCustomers(tokenData)
    user.accessToken = token
    return user
  } else {
    logger.error(util.format(constants.errorMessage.en.msg_password_incorrect))
    throw new Error(constants.errorMessage.en.msg_password_incorrect)
  }
}

user.forgotPassword = async (requestData) => {
  const user = await userModel.findOne({ email: requestData, role: constants.userRole.user })
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
      isActive: true

    })
    await userSession.save()
  }

  const resetPasswordBaseUrl = config.get('resetPasswordBaseUrl')

  const emailData = {
    recipientMail: requestData,
    mailSubject: 'Forgot Password',
    content: `<h1>Reset your password</h1>
  <h2>Dear Customer,</h2>
  <p>please click on below link to reset your password</p>
  <a href=${resetPasswordBaseUrl}?token=${generateToken.accessToken}> reset password link</a>
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

user.resetPassword = async (requestData) => {
  const secretKey = config.get('JWT_TOKEN.SECRET')
  const deToken = jwt.verify(requestData.token, secretKey)
  const userId = deToken.userId

  const user = await userModel.findOne({ _id: userId })

  if (!user) {
    throw new Error(constants.errorMessage.en.msg_user_not_found)
  }
  const session = await userSessionModel.findOne({ userId, isActive: true, type: constants.sessionType.forgotPassword }).sort({ _id: -1 })
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

user.changePassword = async (requestData) => {
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

user.logout = async (requestData) => {
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

user.saveAddress = async (requestData) => {
  requestData.address.addressId = uuidv4()
  requestData.address.updatedAt = new Date()

  const user = await userModel.findOneAndUpdate({ _id: requestData.userId }, {
    $addToSet: { address: requestData.address }
  })

  if (user) {
    return constants.successMessage.en.msg_save_address
  } else {
    logger.error(util.format(constants.errorMessage.en.msg_save_address_error))
    throw new Error(constants.errorMessage.en.msg_save_address_error)
  }
}

user.updateAddress = async (requestData) => {
  requestData.address.addressId = requestData.addressId
  requestData.address.updatedAt = new Date()

  const query = {
    _id: requestData.userId,
    'address.addressId': requestData.addressId
  }

  const user = await userModel.updateOne(query, {
    $set: { 'address.$': requestData.address }
  })

  if (user.acknowledged) {
    return constants.successMessage.en.msg_save_address
  } else {
    logger.error(util.format(constants.errorMessage.en.msg_save_address_error))
    throw new Error(constants.errorMessage.en.msg_save_address_error)
  }
}

user.deleteAddress = async (requestData) => {
  const query = {
    _id: requestData.userId
  }

  const user = await userModel.updateOne(query, { $pull: { address: { addressId: requestData.addressId } } })

  if (user.acknowledged) {
    return constants.successMessage.en.msg_delete_address
  } else {
    logger.error(util.format(constants.errorMessage.en.msg_delete_address_error))
    throw new Error(constants.errorMessage.en.msg_delete_address_error)
  }
}

user.getAllAddress = async (requestData) => {
  const user = await userModel.findOne({ _id: requestData.user._id }, { address: 1, _id: 0 })
  return user.address.sort((a, b) => b.updatedAt - a.updatedAt)
}

user.encryptBody = async (requestData) => {
  const encryptData = CryptoJS.AES.encrypt(requestData, config.get('SECRET_KEY')).toString()
  return encryptData
}

user.updateProfile = async (requestData) => {
  const query = {
    _id: requestData.userId
  }

  const user = await userModel.updateOne(query, {
    $set: requestData.data
  })

  if (user.acknowledged) {
    return constants.successMessage.en.msg_profile_updated
  } else {
    logger.error(util.format(constants.errorMessage.en.msg_profile_save))
    throw new Error(constants.errorMessage.en.msg_profile_save)
  }
}

user.getProfile = async (requestData) => {
  const user = await userModel.findOne({ _id: requestData.user._id }, { address: 0, password: 0 })
  return user
}
module.exports = user
