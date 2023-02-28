const common = require('../../../utils/common')
const constants = require('../../../utils/constants')
const schemas = require('./video-upload-schema')
const video = require('./video-upload-model')

/**
 * @method adminVideoUpload
 * @description  admin Video
 * @module admin - vodep upload
 */

const videoUpload = async function (req, res) {
  try {
    if (req.file === undefined) {
      res.status(constants.httpStatusCode.failedOperation).send({
        code: constants.responseCodes.failedOperation,
        message: constants.errorMessage.en.msg_invalid_file,
        data: false
      })
    }
    const requestData = {}
    requestData.userId = req.user._id
    requestData.file = req.file
    requestData.path = req.body.path
    const data = common.sanitize(requestData, schemas.videoUpload, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.videoUpload)) {
      const status = await video.videoUpload(requestData)
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

const saveVideoDetails = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id
    requestData.body = req.body
    const data = common.sanitize(requestData, schemas.saveVideoDetails, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.saveVideoDetails)) {
      const status = await video.saveVideoDetails(requestData)
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

const getVideoDetails = async function (req, res) {
  try {
    const data = common.sanitize(req.query, schemas.getVideoDetails, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.getVideoDetails)) {
      const status = await video.getVideoDetails(req.query)
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

const updateVideoDetails = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id
    requestData.body = req.body
    const data = common.sanitize(requestData, schemas.updateVideoDetails, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.updateVideoDetails)) {
      const status = await video.updateVideoDetails(requestData)
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

const updateVideoStatus = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id
    requestData.id = req.body.id
    requestData.isActive = req.body.isActive

    const data = common.sanitize(requestData, schemas.updateVideoStatus, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.updateVideoStatus)) {
      const status = await video.updateVideoStatus(requestData)
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

const deleteVideo = async function (req, res) {
  try {
    const data = common.sanitize(req.query, schemas.deleteVideo, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.deleteVideo)) {
      const status = await video.deleteVideo(req.query)
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

const deleteS3Video = async function (req, res) {
  try {
    const data = common.sanitize(req.query, schemas.deleteS3Video, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.deleteS3Video)) {
      const status = await video.deleteS3Video(req.query)
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

const getVideoById = async function (req, res) {
  try {
    const data = common.sanitize(req.query, schemas.getVideoById, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.getVideoById)) {
      const status = await video.getVideoById(req.query)
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
  videoUpload,
  saveVideoDetails,
  getVideoDetails,
  updateVideoDetails,
  updateVideoStatus,
  deleteVideo,
  deleteS3Video,
  getVideoById
}
