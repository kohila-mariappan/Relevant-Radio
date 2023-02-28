const service = require('./video-upload-service')
const fileUploadService = require('../../../utils/fileStorage')

module.exports = function (app) {
  // API to upload video
  app.post('/admin/video/upload', fileUploadService.upload.single('file'), service.videoUpload)

  // API to save video details
  app.post('/admin/video/add', service.saveVideoDetails)

  // API to get video details
  app.get('/admin/video/get', service.getVideoDetails)

  // API to update video details
  app.put('/admin/video/update', service.updateVideoDetails)

  // API to update video status
  app.put('/admin/video/update-status', service.updateVideoStatus)

  // API to delete video
  app.delete('/admin/video/delete', service.deleteVideo)

  // API to delete video from s3
  app.delete('/admin/video/s3/delete', service.deleteS3Video)

  // API to get video details by id
  app.get('/admin/video/getById', service.getVideoById)
}
