const common = require('../../../utils/common')
const constants = require('../../../utils/constants')
const schemas = require('./cms-schema')
const cms = require('./cms-model')

/**
 * @method adminOnBoardAPI
 * @description  admin login
 * @module admin - admin
 */

const saveContentPages = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id
    requestData.body = req.body
    const data = common.sanitize(req.body, schemas.saveContentPages, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.saveContentPages)) {
      const status = await cms.saveContentPages(requestData)
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
      const status = await cms.getContentPagesForCustomer(req.query)
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

const getAllContentPages = async function (req, res) {
  try {
    const data = common.sanitize(req.query, schemas.getAllContentPages, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.getAllContentPages)) {
      const status = await cms.getAllContentPages(req.query)
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

const updateContentPages = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id
    requestData.body = req.body

    const data = common.sanitize(requestData, schemas.updateContentPages, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.updateContentPages)) {
      const status = await cms.updateContentPages(requestData)
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

const updateCmsStatus = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id
    requestData.id = req.body.id
    requestData.isActive = req.body.isActive

    const data = common.sanitize(requestData, schemas.updateCmsStatus, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.updateCmsStatus)) {
      const status = await cms.updateCmsStatus(requestData)
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

const saveFaq = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id
    requestData.body = req.body
    const data = common.sanitize(req.body, schemas.saveFaq, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.saveFaq)) {
      const status = await cms.saveFaq(requestData)
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
      const status = await cms.getAllFaqs(req.query)
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

const updateFaq = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id
    requestData.body = req.body
    const data = common.sanitize(requestData, schemas.updateFaq, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.updateFaq)) {
      const status = await cms.updateFaq(requestData)
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

const updateFaqStatus = async function (req, res) {
  try {
    const requestData = {}
    requestData.userId = req.user._id
    requestData.id = req.body.id
    requestData.isActive = req.body.isActive

    const data = common.sanitize(requestData, schemas.updateFaqStatus, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.updateFaqStatus)) {
      const status = await cms.updateFaqStatus(requestData)
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

const getFaqById = async function (req, res) {
  try {
    const data = common.sanitize(req.query, schemas.getFaqById, constants.moduleNames.user, constants.platforms.admin)
    if (schemas.validate(data, schemas.getFaqById)) {
      const status = await cms.getFaqById(req.query)
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
  saveContentPages,
  getContentPagesForCustomer,
  getAllContentPages,
  updateContentPages,
  updateCmsStatus,
  saveFaq,
  getAllFaqs,
  updateFaq,
  updateFaqStatus,
  getFaqById
}
