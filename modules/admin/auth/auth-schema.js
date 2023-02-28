/* eslint-disable quote-props */
const util = require('util')
const Validator = require('jsonschema').Validator
const logger = require('../../../utils/logger')
const _validator = new Validator()

/**
 * @method saveAuthuser
 * @description admin api's
 * @module admin - admin
 */

const schemas = function () {
}

schemas.saveAuthUser = {
  id: '/auth/register',
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
    dob: {
      type: Date,
      required: true
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 12
    },
    role: {
      type: String,
      required: true
    }
  }
}

schemas.login = {
  id: '/admin/login',
  type: 'object',
  properties: {
    data: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 255
    }
  }
}

schemas.forgotPassword = {
  id: '/admin/forgotPassword',
  type: 'object',
  properties: {
    email: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 255
    }
  }
}

schemas.resetPassword = {
  id: '/admin/resetPassword',
  type: 'object',
  properties: {
    token: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 255
    }
  }
}

schemas.changePassword = {
  id: '/admin/change-password',
  type: 'object',
  properties: {
    data: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 255
    }
  }
}

schemas.getLogedInUserList = {
  id: '/admin/loggedIn/userList',
  type: 'string',
  properties: {
    page: {
      type: Number
    },
    limit: {
      type: Number
    },
    date: {
      type: String
    }
  }
}
schemas.getLogedInUserCount = {
  id: '/admin/loggedIn/userCount',
  type: 'String',
  properties: {
    date: {
      type: String
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
