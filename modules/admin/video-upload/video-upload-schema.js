/* eslint-disable quote-props */
const util = require('util')
const Validator = require('jsonschema').Validator
const logger = require('../../../utils/logger')
const _validator = new Validator()

const schemas = function () {
}

schemas.videoUpload = {
  id: '/admin/video-upload',
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
      enum: ['video', 'thumbnail'],
      required: true
    }
  }
}

schemas.saveVideoDetails = {
  id: '/admin/video/save',
  type: 'object',
  properties: {
    userId: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    body: {
      type: Object,
      properties: {
        title: {
          type: String,
          required: true,
          minLength: 1,
          maxLength: 255
        },
        description: {
          type: String,
          required: true,
          minLength: 1,
          maxLength: 300
        },
        thumbnail: {
          type: String,
          required: true,
          minLength: 1,
          maxLength: 300
        },
        s3FileKey: {
          type: String
        },
        sequence: {
          type: Number,
          required: true
        },
        url: {
          type: String
        }
      }
    }
  }
}

schemas.getVideoDetails = {
  id: '/admin/video/list',
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
    },
    fromDate: {
      type: String
    },
    toDate: {
      type: String
    }
  }
}

schemas.updateVideoDetails = {
  id: '/admin/video/update',
  type: 'object',
  properties: {
    userId: {
      type: String,
      required: true
    },
    body: {
      type: Object,
      properties: {
        title: {
          type: String,
          minLength: 1,
          maxLength: 255
        },
        description: {
          type: String,
          minLength: 1,
          maxLength: 300
        },
        thumbnail: {
          type: String,
          minLength: 1,
          maxLength: 300
        },
        s3FileKey: {
          type: String
        },
        sequence: {
          type: Number
        },
        url: {
          type: String
        }
      }
    }
  }
}

schemas.updateVideoStatus = {
  id: '/admin/video/status',
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

schemas.deleteVideo = {
  id: '/admin/video/delete',
  type: 'object',
  properties: {
    id: {
      type: String,
      required: true
    }
  }
}

schemas.getVideoById = {
  id: '/admin/video/id',
  type: 'object',
  properties: {
    _id: {
      type: String,
      required: true
    }
  }
}

schemas.deleteS3Video = {
  id: '/admin/video/s3/delete',
  type: 'object',
  properties: {
    key: {
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
