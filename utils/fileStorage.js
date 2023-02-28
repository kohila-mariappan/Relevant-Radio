const aws = require('aws-sdk')
const fs = require('fs')
const logger = require('./logger')
const util = require('util')
const config = require('../configurations/config')
const multer = require('multer')
const PDFDocument = require('pdfkit')
const path = require('path')
const libre = require('libreoffice-convert')
libre.convertAsync = require('util').promisify(libre.convert)

const s3 = new aws.S3({
  accessKeyId: config.get('AWS_S3.ACCESSKEYID'),
  secretAccessKey: config.get('AWS_S3.SECRETACCESSKEY'),
  region: config.get('AWS_S3.REGION')
})

const fileUpload = async (requestData) => {
  const fileName = requestData.file.originalname
  const timeStamp = new Date().getTime()
  const arr = fileName.split('.')
  const extension = arr[arr.length - 1]
  const fileNameToBeSave = arr[0] + '-' + timeStamp + '.' + extension
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: config.get('AWS_S3.BUCKET_NAME'),
      Body: fs.createReadStream(requestData.file.path),
      Key: requestData.path + '/' + fileNameToBeSave,
      ContentType: requestData.file.mimetype
    }
    if (requestData.file.mimetype === 'application/pdf') {
      delete params.ContentType
    }
    s3.upload(params, async function (error, data) {
      if (error) {
        logger.error(util.format('Error While Uploading FileTo S3 Bucket Error: %j', error))
        reject(error)
      } else {
        console.log(data)
        resolve(data)
      }
    })
  })
}

const getSingedUrl = async (key) => {
  const params = {
    Bucket: config.get('AWS_S3.BUCKET_NAME'),
    Key: key,
    Expires: 604800 // 7 days
  }

  try {
    const url = await new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        err ? reject(err) : resolve(url)
      })
    })
    return url
  } catch (err) {
    if (err) {
      console.log(err)
      throw err
    }
  }
}

// multer storage config
const storage = multer.diskStorage(
  {

    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }

  })

// file filter for allowed types
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'video/mp4' ||
    file.mimetype === 'video/x-flv' || file.mimetype === 'application/x-mpegURL||video/MP2T' || file.mimetype === 'video/3gpp' ||
    file.mimetype === 'video/quicktime' || file.mimetype === 'video/x-msvideo' || file.mimetype === 'video/x-ms-wmv' || file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

// multer upload for validation
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }
})

const deleteMultipleFile = function (objects) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: config.get('AWS_S3.BUCKET_NAME'),
      Delete: {
        Objects: objects,
        Quiet: false
      }
    }
    s3.deleteObjects(params, function (error, data) {
      if (error) {
        logger.error(util.format('Error While Removing File From S3 Bucket. Error: %j', error))
        reject(error)
      } else {
        logger.info(util.format('File Deleted From S3 Bucket Successfully'))
        resolve(true)
      }
    })
  })
}

const deleteFile = function (key) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: config.get('AWS_S3.BUCKET_NAME'),
      Key: key
    }
    s3.deleteObject(params, function (error, data) {
      if (error) {
        logger.error(util.format('Error While Removing File From S3 Bucket. Error: %j', error))
        reject(error)
      } else {
        logger.info(util.format('File Deleted From S3 Bucket Successfully'))
        resolve('File Deleted From S3 Bucket Successfully')
      }
    })
  })
}

const imageToPdfUpload = async function (fileName, imagePath) {
  try {
    const doc = new PDFDocument()
    const stream = fs.createWriteStream(`./${fileName}`)
    doc.pipe(stream)

    doc.image(imagePath, {
      fit: [500, 400],
      align: 'center',
      valign: 'center'
    })
    doc.end()

    const appDir = path.dirname(require.main.filename)
    const fileContent = await fs.createReadStream(appDir + `/${fileName}`)
    fs.unlinkSync(appDir + `/${fileName}`)

    return uploadBinaryFile(fileName, fileContent)
  } catch (error) {
    logger.error(util.format('Error while converting to pdf : ', '. Error: %j', error))
    throw new Error(error)
  }
}

const wordToPdfUpload = async function (fileName, filePath) {
  try {
    const file = fs.readFileSync(filePath)
    const convert = await libre.convertAsync(file, '.pdf', undefined)

    fs.writeFileSync(fileName, convert)
    fs.unlinkSync(filePath)
    fs.unlinkSync(fileName)

    return uploadBinaryFile(fileName, convert)
  } catch (error) {
    logger.error(util.format('Error while converting to pdf : ', '. Error: %j', error))
    throw new Error(error)
  }
}

const uploadBinaryFile = async (fileName, fileContent) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: config.get('AWS_S3.BUCKET_NAME'),
      Body: fileContent,
      Key: fileName,
      ContentType: 'application/pdf'
    }
    s3.upload(params, async function (error, data) {
      if (error) {
        logger.error(util.format('Error While Uploading File To S3 Bucket Error: %j', error))
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = {
  fileUpload,
  getSingedUrl,
  upload,
  deleteMultipleFile,
  deleteFile,
  imageToPdfUpload,
  wordToPdfUpload,
  uploadBinaryFile
}
