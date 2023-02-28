const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const util = require('util')
const moment = require('moment')
const config = require('../configurations/config')
const logger = require('./logger')
const commonService = require('./common')
const constants = require('./constants')
const userSessionModel = require('../models/user.session.model')
const userModel = require('../models/user.model')

const mailer = function () { }

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  // host: config.get('mailer.host'),
  port: config.get('mailer.port'),
  secureConnection: false,
  requireTLS: true,
  auth: {
    user: config.get('mailer.email'),
    pass: config.get('mailer.password')
  },
  tls: {
    ciphers: 'SSLv3'
  }
}))

const sendMail = function (mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, information) {
      if (error) {
        logger.error(util.format('Error While Sending Email. Error: %j', error))
        reject(error)
      } else {
        logger.info(util.format('Mail Sending Successful.', information))
        resolve(information)
      }
    })
  })
}

mailer.sendMail = function (data) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: config.get('mailer.supportMail'),
      to: data.recipientMail,
      // cc: data.ccTo,
      bcc: data.bccTo,
      subject: data.mailSubject,
      html: data.content
    }
    sendMail(mailOptions).then((status) => {
      logger.info(util.format('Mail Sending Successful To User: ', data.recipientMail + '. Time: ', moment().utc().format()))
      resolve(true)
    }).catch((error) => {
      logger.error(util.format('Error While Sending Mail To User: ', data.recipientMail + '. Time: ', moment().utc().format() + '. Error: %j', error))
      reject(error)
    })
  })
}

mailer.sendEmailVerificationLink = async function (email) {
  const user = await userModel.findOne({ email, role: constants.userRole.user })

  if (!user) {
    throw new Error(constants.errorMessage.en.msg_email_not_registered)
  }

  await userSessionModel.findOneAndDelete({ userId: user._id, type: constants.sessionType.emailVerification, isActive: true })
  const uniqueId =
        Date.now().toString(36) + Math.random().toString(36).substring(2)

  const payload = {
    userId: user._id.toString(),
    uuid: uniqueId
  }

  const generateToken = commonService.signPayload(payload)

  if (generateToken) {
    const emailVerificationData = {
      type: constants.sessionType.emailVerification,
      userId: user._id.toString(),
      verificationToken: uniqueId,
      isActive: true
    }
    const userSession = new userSessionModel(emailVerificationData)
    await userSession.save()
  }

  const emailVerificationUrl = config.get('emailVerifyUrl')

  const emailData = {
    recipientMail: user.email,
    mailSubject: 'Verify Email',
    content: `<h2>Hello ${user.firstName},</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${emailVerificationUrl}?token=${generateToken.accessToken}> Click here</a>
        </div>`
  }
  await mailer.sendMail(emailData)
}

module.exports = mailer
