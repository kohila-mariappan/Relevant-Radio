/* eslint-disable quote-props */
const util = require('util')
const Validator = require('jsonschema').Validator
const logger = require('../../../utils/logger')
const _validator = new Validator()

const schemas = function () {
}

schemas.contactUs = {
  id: '/home/contactUs',
  type: 'object',
  properties: {
    firstName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    lastName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: 1,
      maxLength: 255
    },
    countryCode: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 4
    },
    mobile: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 13
    },
    message: {
      type: String,
      required: false,
      minLength: 1,
      maxLength: 255
    }
  }
}

schemas.updateVideoPlayCount = {
  id: '/user/video/count',
  type: 'object',
  properties: {
    _id: {
      type: String
    }
  }
}
schemas.getVideoDetails = {
  id: '/user/video/list',
  type: 'object',
  properties: {
    search: {
      type: String
    },
    isActive: {
      type: String
    },
    page: {
      type: Number
    },
    size: {
      type: Number
    },
    order: {
      type: String
    },
    sort: {
      type: String
    }
  }
}

schemas.getContentPagesForCustomer = {
  id: '/user/getCms',
  type: 'object',
  properties: {
    _id: {
      type: String,
      required: true
    }
  }
}

schemas.getAllFaq = {
  id: '/user/faq/get',
  type: 'object',
  properties: {
    isActive: {
      type: String,
      required: true
    }
  }
}

schemas.validate = function (object, schema) {
  const errors = _validator.validate(object, schema).errors
  if (errors.length > 0) {
    logger.error(util.format('Schema validation failed for id:- %s errors:- %j', schema.id, errors))
  }
  return errors.length <= 0
}

module.exports = schemas
