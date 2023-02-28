const common = require('../../../utils/common')
const constants = require('../../../utils/constants')
const schemas = require('./files-schema')
const file = require('./files-model')

/**
 * @method file-document API
 * @description  user file-document
 * @module user - files
 */

const fileUpload = async function (req, res) {
  try {
    if (req.file === undefined) {
      res.status(constants.httpStatusCode.failedOperation).send({
        code: constants.responseCodes.failedOperation,
        message: constants.errorMessage.en.msg_invalid_file,
        data: false
      })
    }
    const requestData = {}
    requestData.userId = req.user._id.toString()
    requestData.file = req.file
    requestData.path = req.body.path
    requestData.doc = req.body.doc
    const data = common.sanitize(requestData, schemas.fileUpload, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.fileUpload)) {
      const status = await file.fileUpload(requestData)
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

const downloadFile = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id.toString()
    requestData.id = req.query.id
    const data = common.sanitize(requestData, schemas.downloadFile, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.downloadFile)) {
      const status = await file.downloadFile(requestData)
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

const getFiles = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id.toString()
    requestData.type = req.query.type
    const data = common.sanitize(requestData, schemas.getFiles, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.getFiles)) {
      const status = await file.getFiles(requestData)
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

const deleteFile = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id.toString()
    requestData.id = req.query.id
    const data = common.sanitize(requestData, schemas.deleteFile, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.deleteFile)) {
      const status = await file.deleteFile(requestData)
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

const sharePdf = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id.toString()
    requestData.body = req.body
    const data = common.sanitize(requestData, schemas.sharePdf, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.sharePdf)) {
      const status = await file.sharePdf(requestData)
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

const convertAndUpload = async function (req, res) {
  try {
    if (req.file === undefined) {
      res.status(constants.httpStatusCode.failedOperation).send({
        code: constants.responseCodes.failedOperation,
        message: constants.errorMessage.en.msg_invalid_file,
        data: false
      })
    }
    const requestData = {}
    requestData.userId = req.user._id.toString()
    requestData.file = req.file
    requestData.path = req.body.path
    requestData.doc = req.body.doc
    const data = common.sanitize(requestData, schemas.fileUpload, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.fileUpload)) {
      const status = await file.convertAndUpload(requestData)
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

const getSharedUserList = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id.toString()
    requestData.id = req.query.id
    const data = common.sanitize(requestData, schemas.getSharedUserList, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.getSharedUserList)) {
      const status = await file.getSharedUserList(requestData)
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
  fileUpload,
  downloadFile,
  getFiles,
  deleteFile,
  sharePdf,
  convertAndUpload,
  getSharedUserList
}
