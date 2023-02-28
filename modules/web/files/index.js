const service = require('./files-service')
const fileUploadService = require('../../../utils/fileStorage')

module.exports = function (app) {
  // API to upload file
  app.post('/files/upload', fileUploadService.upload.single('file'), service.fileUpload)

  // API to download file
  app.get('/files/download', service.downloadFile)

  // API to get file list
  app.get('/files/get', service.getFiles)

  // API to delete file
  app.delete('/files/delete', service.deleteFile)

  // API to share pdf via email
  app.post('/files/share-pdf', service.sharePdf)

  // API to convert to pdf
  app.post('/files/convert/upload', fileUploadService.upload.single('file'), service.convertAndUpload)

  // API to get shared user list
  app.get('/files/shared-with', service.getSharedUserList)
}
