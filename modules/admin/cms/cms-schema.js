/* eslint-disable quote-props */
const util = require('util')
const Validator = require('jsonschema').Validator
const logger = require('../../../utils/logger')
const _validator = new Validator()

const schemas = function () {
}

schemas.saveContentPages = {
  id: '/admin/saveCms',
  type: 'object',
  properties: {
    title: {
      type: String,
      unique: true,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    description: {
      type: String,
      required: true
    }
  }
}

schemas.getContentPagesForCustomer = {
  id: '/admin/getCms',
  type: 'object',
  properties: {
    _id: {
      type: String,
      required: true
    }
  }
}

schemas.getAllContentPages = {
  id: '/admin/cms/all',
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

schemas.getAllFaq = {
  id: '/admin/faq/all',
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

schemas.updateContentPages = {
  id: '/admin/updateCms',
  type: 'object',
  properties: {
    userId: {
      type: String,
      required: true
    },
    body: {
      type: Object,
      properties: {
        id: {
          type: String,
          required: true
        },
        description: {
          type: String
        }

      }
    }
  }
}

schemas.updateCmsStatus = {
  id: '/admin/cms/status',
  type: 'object',
  properties: {
    userId: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    }
  }
}

schemas.saveFaq = {
  id: '/admin/cms/saveFaq',
  type: 'object',
  properties: {
    question: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    answer: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    sequence: {
      type: Number,
      required: true
    }
  }
}

schemas.updateFaq = {
  id: '/admin/cms/updateFaq',
  type: 'object',
  properties: {
    userId: {
      type: String,
      required: true
    },
    body: {
      type: Object,
      properties: {
        id: {
          type: String,
          required: true
        },
        question: {
          type: String
        },
        answer: {
          type: String
        }

      }
    }
  }
}

schemas.updateFaqStatus = {
  id: '/admin/cms/faq/status',
  type: 'object',
  properties: {
    userId: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    }
  }
}

schemas.getFaqById = {
  id: '/admin/faq/id',
  type: 'object',
  properties: {
    _id: {
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
