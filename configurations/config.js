const convict = require('convict')
const path = require('path')

const config = convict({
  emailVerifyUrl: {
    doc: 'Email Verification Base URL',
    format: String,
    default: 'https://catholiclw-api.dev.brainvire.net/verify-email'
  },
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'qa'],
    default: 'development',
    env: 'NODE_ENV',
    arg: 'env'
  },
  cluster: {
    workerCount: {
      doc: 'No of worker Thread',
      format: Number,
      default: 12
    }
  },
  server: {
    port: {
      doc: 'HTTP port to bind',
      format: 'Number',
      default: 5003
    },
    timeout: {
      doc: 'Server Timeout',
      format: 'Number',
      default: 60000
    },
    enableHttpLogging: {
      doc: 'Enable HTTP Logging',
      format: Boolean,
      default: true
    },
    enableCompression: {
      doc: 'Enable HTTP compression',
      format: Boolean,
      default: true
    },
    security: {
      enableXframe: {
        doc: 'Enable Iframe protection',
        format: Boolean,
        default: true
      },
      enableHidePoweredBy: {
        doc: 'Hide X powered by Header',
        format: Boolean,
        default: true
      },
      enableNoCaching: {
        doc: 'Enable No caching',
        format: Boolean,
        default: true
      },
      enableCSP: {
        doc: 'Enable CSP policy',
        format: Boolean,
        default: false
      },
      enableHSTS: {
        doc: 'Enable HSTS',
        format: Boolean,
        default: true
      },
      enableXssFilter: {
        doc: 'Enable XSS filter protection',
        format: Boolean,
        default: true
      },
      enableForceContentType: {
        doc: 'Enable force content type',
        format: Boolean,
        default: false
      },
      salt: {
        doc: 'Server Security Salt',
        format: String,
        default: '$2a$10$e.oPc.dyrwRoQCpDvO9Rhe'
      }
    },
    bodyParser: {
      limit: {
        doc: 'maximum request body size',
        format: String,
        default: '100kb'
      }
    }
  },
  mongo: {
    url: {
      doc: 'Holds the MongoDb Server Url',
      format: String,
      default: 'mongodb://localhost:27017/catholiclw_local_db'
    },
    host: {
      doc: 'Holds the MongoDb Server Host',
      format: String,
      default: 'localhost'
    },
    port: {
      doc: 'Holds the MongoDb Server Port',
      format: Number,
      default: 2701
    },
    username: {
      doc: 'Holds the Mongodb Server Username',
      format: String,
      default: ''
    },
    password: {
      doc: 'Holds the Mongodb Server Password',
      format: String,
      default: ''
    },
    database: {
      doc: 'Holds the Database In Mongdb Server',
      format: String,
      default: 'catholiclw_local_db'
    }
  },
  logger: {
    httpLogFormat: {
      doc: 'HTTP log format',
      format: String,
      default:
        ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] | :response-time ms ":referrer" ":user-agent"'
    },
    httpLogFileName: {
      doc: 'HTTP log File name',
      format: String,
      default: 'http.log'
    },
    logFileName: {
      doc: 'Log File name',
      format: String,
      default: 'logs.log'
    },
    exceptionLogFileName: {
      doc: 'Exception log File name',
      format: String,
      default: 'exceptions.log'
    },
    logFileSize: {
      doc: 'logs File Max File size',
      format: Number,
      default: 5242880
    },
    path: {
      doc: 'Holds the Log Path',
      format: String,
      default: './logs/'
    }
  },
  mailer: {
    host: {
      doc: 'Mailer Host',
      format: String,
      default: ''
    },
    port: {
      doc: 'Mailer Port',
      format: String,
      default: ''
    },
    email: {
      doc: 'Mailer Authentication Email',
      format: String,
      default: ''
    },
    password: {
      doc: 'Mailer Authentication Password',
      format: String,
      default: ''
    },
    supportMail: {
      doc: 'Mailer Support Email',
      format: String,
      default: ''
    }
  },
  templatePath: {
    doc: 'Template Folder Path',
    format: String,
    default: './Email-Templates/'
  },
  JWT_TOKEN: {
    SECRET: {
      doc: 'Holds the JWT secret',
      format: String,
      default: '$2a$10$e.oPc.dyrwRoQCpDvO9Rhe'
    },
    ALGORITHM: {
      doc: 'Holds the JWT Algorithm',
      format: String,
      default: 'HS512'
    },
    expireTime: {
      doc: 'Holds the JWT Token Expiration Time',
      format: String,
      default: '1d'
    },
    ttl: {
      doc: 'Holds the JWT Token Time to Leave',
      format: Number,
      default: 86400000
    }
  },
  resetPasswordBaseUrl: {
    doc: 'Reset Password Base URL',
    format: String,
    default: 'https://catholiclw-api.dev.brainvire.net'
  },
  SECRET_KEY: {
    doc: 'Holds the Crypto Secret',
    format: String,
    default: '$2a$10$e.oPc.dyrwRoQCpDvO9Rhe'
  },
  adminResetPasswordBaseUrl: {
    doc: 'Reset Password Base URL For Admin',
    format: String,
    default: 'https://catholiclw-admin.dev.brainvire.net/reset-password'
  },
  adminEmail: {
    doc: 'Admin Email For Contact Us Enquiry',
    format: String,
    default: 'noreply.relevant.radio@gmail.com'
  },
  AWS_S3: {
    BUCKET_NAME: {
      doc: 'Holds the Aws S3 Bucket Name',
      format: String,
      default: 'catholiclw-dev-static'
    },
    ACCESSKEYID: {
      doc: 'Holds the Aws S3 Access Key Id',
      format: String,
      default: ''
    },
    SECRETACCESSKEY: {
      doc: 'Holds the Aws S3 Secret Access Key',
      format: String,
      default: ''
    },
    REGION: {
      doc: 'Holds the Aws S3 Region',
      format: String,
      default: 'us-east-1'
    }
  }
})

// config.loadFile('./configurations/config-' + config.get('env') + '.json');
config.loadFile(path.join(__dirname, '/config-' + config.get('env') + '.json'))

config.set(
  'logger.httpLogFileName',
  config.get('logger.path') + config.get('logger.httpLogFileName')
)
config.set(
  'logger.logFileName',
  config.get('logger.path') + config.get('logger.logFileName')
)
config.set(
  'logger.exceptionLogFileName',
  config.get('logger.path') + config.get('logger.exceptionLogFileName')
)

// validate
config.validate()

module.exports = config
