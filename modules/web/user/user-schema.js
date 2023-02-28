/* eslint-disable quote-props */
const util = require('util')
const Validator = require('jsonschema').Validator
const logger = require('../../../utils/logger')
const _validator = new Validator()

/**
 * @method saveUser
 * @description user api's
 * @module user - user
 */

const schemas = function () {
}

schemas.saveUser = {
  id: '/',
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
      maxLength: 255
    },
    role: {
      type: String,
      required: true
    }
  }
}

schemas.emailVerify = {
  id: '/user/email/verify',
  type: 'object',
  properties: {
    token: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 255
    }
  }
}

schemas.sendVerificationLink = {
  id: '/send-verification-mail',
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

schemas.login = {
  id: '/user/login',
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
  id: '/user/forgotPassword/:email',
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
  id: '/resetPassword',
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
      minLength: 1,
      maxLength: 255
    }
  }
}

schemas.changePassword = {
  id: '/change-password',
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

schemas.updateProfile = {
  id: '/update-profile',
  type: 'object',
  properties: {
    firstName: {
      type: String,
      required: false,
      minLength: 1,
      maxLength: 255
    },
    lastName: {
      type: String,
      required: false,
      minLength: 1,
      maxLength: 255
    },
    dob: {
      type: Date,
      required: false
    }
  }
}

schemas.saveAddress = {
  id: '/saveAddress',
  type: 'object',
  properties: {
    addressLine1: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 100
    },
    addressLine2: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 100
    },
    countryCode: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 3
    },
    mobile: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 13
    },
    country: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50
    },
    state: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50
    },
    city: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50
    },
    zipCode: {
      type: Number,
      required: true,
      minLength: 1,
      maxLength: 10
    }
  }
}

schemas.updateAddress = {
  id: '/updateAddress',
  type: 'object',
  properties: {
    addressLine1: {
      type: String,
      minLength: 1,
      maxLength: 100
    },
    addressLine2: {
      type: String,
      minLength: 1,
      maxLength: 100
    },
    countryCode: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 3
    },
    mobile: {
      type: String,
      minLength: 1,
      maxLength: 13
    },
    country: {
      type: String,
      minLength: 1,
      maxLength: 50
    },
    state: {
      type: String,
      minLength: 1,
      maxLength: 50
    },
    city: {
      type: String,
      minLength: 1,
      maxLength: 50
    },
    zipCode: {
      type: Number,
      minLength: 1,
      maxLength: 255
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
