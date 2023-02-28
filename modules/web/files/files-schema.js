/* eslint-disable quote-props */
const util = require('util')
const Validator = require('jsonschema').Validator
const logger = require('../../../utils/logger')
const _validator = new Validator()

const schemas = function () {
}

schemas.fileUpload = {
  id: '/user/file-upload',
  type: 'object',
  properties: {
    userId: {
      type: String,
      unique: true,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    file: {
      type: String,
      required: true
    },
    path: {
      type: String,
      enum: ['document'],
      required: true
    },
    doc: {
      type: String,
      enum: ['will', 'funeral', 'health', 'other'],
      required: true
    }
  }
}

schemas.downloadFile = {
  id: '/user/file/download',
  type: 'object',
  properties: {
    userId: {
      type: String,
      unique: true,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    id: {
      type: String,
      required: true
    }
  }
}

schemas.getFiles = {
  id: '/user/file/get',
  type: 'object',
  properties: {
    userId: {
      type: String,
      unique: true,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    type: {
      type: String,
      required: true
    }
  }
}

schemas.deleteFile = {
  id: '/user/file/delete',
  type: 'object',
  properties: {
    userId: {
      type: String,
      unique: true,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    id: {
      type: String,
      required: true
    }
  }
}

schemas.sharePdf = {
  id: '/user/file/share-pdf',
  type: 'object',
  properties: {
    userId: {
      type: String,
      unique: true,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    body: {
      type: Object,
      properties: {
        id: {
          type: String,
          minLength: 1,
          maxLength: 255
        },
        email: {
          type: String,
          minLength: 1,
          maxLength: 255
        }
      }
    }
  }
}

schemas.getSharedUserList = {
  id: '/user/share/list',
  type: 'object',
  properties: {
    userId: {
      type: String,
      unique: true,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    id: {
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
