const common = require('../../../utils/common')
const constants = require('../../../utils/constants')
const schemas = require('./home-page-schema')
const homePage = require('./home-page-model.js')
const adminVideo = require('../../admin/video-upload/video-upload-model')

/**
 * @method homePageAPI
 * @description  user HomePage
 * @module user - HomePage
 */

const contactUs = async function (req, res) {
  try {
    const data = common.sanitize(req.body, schemas.contactUs, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.contactUs)) {
      const status = await homePage.contactUs(req.body)
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

const getContentPagesForCustomer = async function (req, res) {
  try {
    const data = common.sanitize(req.query, schemas.getContentPagesForCustomer, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.getContentPagesForCustomer)) {
      const status = await homePage.getContentPagesForCustomer(req.query)
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

const getAllFaqs = async function (req, res) {
  try {
    const data = common.sanitize(req.query, schemas.getAllFaq, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.getAllFaq)) {
      const status = await homePage.getAllFaqs(req.query)
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

const getVideoList = async function (req, res) {
  try {
    const data = common.sanitize(req.query, schemas.getVideoDetails, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.getVideoDetails)) {
      const status = await adminVideo.getVideoDetails(req.query)
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

const updateVideoPlayCount = async function (req, res) {
  try {
    const data = common.sanitize(req.query, schemas.updateVideoPlayCount, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.updateVideoPlayCount)) {
      const status = await homePage.updateVideoPlayCount(req.query)
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

module.exports = {
  contactUs,
  getVideoList,
  updateVideoPlayCount,
  getContentPagesForCustomer,
  getAllFaqs
}
