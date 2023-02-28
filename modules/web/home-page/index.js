const service = require('./home-page-service')

module.exports = function (app) {
  // API to save user
  app.post('/home/contact/add', service.contactUs)

  // API to get video list
  app.get('/home/video/get', service.getVideoList)

  // API to update video play count
  app.put('/home/video/count', service.updateVideoPlayCount)

  // API to get content pages details
  app.get('/home/cms/getById', service.getContentPagesForCustomer)

  // API to get all faq for customer
  app.get('/home/faq/get', service.getAllFaqs)
}
