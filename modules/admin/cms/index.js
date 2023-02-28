const service = require('./cms-service')

module.exports = function (app) {
  // API to save content pages
  app.post('/admin/cms/add', service.saveContentPages)

  // public API to get content pages
  app.get('/admin/cms/getById', service.getContentPagesForCustomer)

  // public API to get all content pages for admin
  app.get('/admin/cms/get', service.getAllContentPages)

  // API to update content pages
  app.put('/admin/cms/update', service.updateContentPages)

  // API to update cms status
  app.put('/admin/cms/update-status', service.updateCmsStatus)

  // API to save faq
  app.post('/admin/faq/add', service.saveFaq)

  // API to get all faq
  app.get('/admin/faq/get', service.getAllFaqs)

  // API to get faq details by id
  app.get('/admin/faq/getById', service.getFaqById)

  // API to update faq
  app.put('/admin/faq/update', service.updateFaq)

  // API to update faq status
  app.put('/admin/faq/update-status', service.updateFaqStatus)
}
