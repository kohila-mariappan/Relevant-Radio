const documentModel = require('../../../models/document.model')
const constants = require('../../../utils/constants')
const fileUploadService = require('../../../utils/fileStorage')
const emailService = require('../../../utils/mailer')
const logger = require('../../../utils/logger')
const util = require('util')

/**
 * @description file-document api's
 * @module files - files
 */
const file = function () {}

file.fileUpload = async (requestData) => {
  if ((requestData.file.size / 1024 / 1024).toFixed() > 10) {
    throw new Error(constants.errorMessage.en.msg_pdf_size)
  }

  const files = await documentModel.find({ userId: requestData.userId, type: requestData.doc })

  if (files.length === 2) {
    throw new Error(constants.errorMessage.en.msg_max_file_error)
  }
  const uploadFile = await fileUploadService.fileUpload(requestData)

  const docName = requestData.doc + new Date().getTime() + '.pdf'

  if (uploadFile) {
    const saveData = {
      userId: requestData.userId,
      type: requestData.doc,
      title: docName,
      s3FileKey: uploadFile.Key
    }

    // updating isLatest flag for old records
    await documentModel.updateMany({ userId: requestData.userId, isLatest: true, type: requestData.doc }, { $set: { isLatest: false } })
    const file = new documentModel(saveData)
    await file.save()
    return uploadFile
  }
}

file.downloadFile = async (requestData) => {
  const file = await documentModel.findOne({ userId: requestData.userId, _id: requestData.id })

  if (!file) {
    throw new Error(constants.errorMessage.en.msg_file_not_exist)
  }
  return fileUploadService.getSingedUrl(file.s3FileKey)
}

file.getFiles = async (requestData) => {
  const files = await documentModel.find({ userId: requestData.userId, type: requestData.type }).sort({ updated_at: -1 }).lean()
  const fileList = []
  for (const x of files) {
    const s3FileKey = await fileUploadService.getSingedUrl(x.s3FileKey)
    fileList.push({ ...x, s3FileKey })
  }
  return fileList
}

file.deleteFile = async (requestData) => {
  const file = await documentModel.findOne({ userId: requestData.userId, _id: requestData.id })

  if (!file) {
    throw new Error(constants.errorMessage.en.msg_file_not_exist)
  }
  await fileUploadService.deleteFile(file.s3FileKey)

  await documentModel.findOneAndDelete({ _id: requestData.id })

  // updating isLatest flag for old record
  await documentModel.updateOne({ userId: requestData.userId, isLatest: false, type: file.type }, { $set: { isLatest: true } })
  return constants.successMessage.en.msg_file_deleted
}

file.sharePdf = async (requestData) => {
  const file = await documentModel.findOne({ userId: requestData.userId, _id: requestData.body.id })

  if (!file) {
    throw new Error(constants.errorMessage.en.msg_file_not_exist)
  }

  const signedUrl = await fileUploadService.getSingedUrl(file.s3FileKey)

  const emailData = {
    recipientMail: requestData.body.email,
    mailSubject: 'Document Link!',
    content: `
  <h2>Dear Customer,</h2>
  <p>please click on below link to donwload pdf</p>
  <a href=${signedUrl}> download pdf</a>
  </div>`
  }
  const sendMail = emailService.sendMail(emailData)

  if (!file.sharedWith.includes(requestData.body.email)) {
    await documentModel.updateOne(
      { _id: requestData.body.id },
      {
        $push: { sharedWith: requestData.body.email }
      }
    )
  }

  if (sendMail) {
    return constants.successMessage.en.msg_pdf_link_sent
  } else {
    logger.error(util.format(constants.errorMessage.en.msg_file_link_failed))
    throw new Error(constants.errorMessage.en.msg_file_link_failed)
  }
}

file.convertAndUpload = async (requestData) => {
  if ((requestData.file.size / 1024 / 1024).toFixed() > 10) {
    throw new Error(constants.errorMessage.en.msg_pdf_size)
  }

  const docName = requestData.doc + new Date().getTime() + '.pdf'

  let uploadFile
  if (requestData.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    uploadFile = await fileUploadService.wordToPdfUpload(docName, requestData.file.path)
  }

  if (requestData.file.mimetype === 'image/jpg' || requestData.file.mimetype === 'image/png' || requestData.file.mimetype === 'image/jpeg') {
    uploadFile = await fileUploadService.imageToPdfUpload(docName, requestData.file.path)
  }

  if (uploadFile) {
    const saveData = {
      userId: requestData.userId,
      type: requestData.doc,
      title: docName,
      s3FileKey: uploadFile.Key
    }
    const file = new documentModel(saveData)
    await file.save()
    return uploadFile
  }
}
file.getSharedUserList = async (requestData) => {
  const files = await documentModel.find({ userId: requestData.userId, _id: requestData.id }, { sharedWith: 1, _id: 0 })
  return files[0].sharedWith
}

module.exports = file
