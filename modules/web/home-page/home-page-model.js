const emailService = require('../../../utils/mailer')
const commonService = require('../../../utils/common')
const contactUsModel = require('../../../models/contact_us.model')
const config = require('../../../configurations/config')
const mediaModel = require('../../../models/media.model')
const cmsModel = require('../../../models/cms.model')
const adminCmsModel = require('../../admin/cms/cms-model')

/**
 * @description homePage api's
 * @module homePage - homePage
 */
const homePage = function () {}

homePage.contactUs = async (requestData) => {
  requestData.firstName = commonService.toPascalCase(requestData.firstName)
  requestData.lastName = commonService.toPascalCase(requestData.lastName)
  const contactData = new contactUsModel(requestData)
  await contactData.save()

  const adminMail = config.get('adminEmail')

  const emailData = {
    recipientMail: adminMail,
    mailSubject: 'Enquiry!',
    content: `You got a enquiry from: <br>
    Email : ${requestData.email} <br>
    Name: ${requestData.firstName} <br>
    Mobile: ${requestData.mobile} <br>
    Message: ${requestData?.message}`
  }
  await emailService.sendMail(emailData)
  return {
    _id: contactData._id
  }
}

homePage.updateVideoPlayCount = async (requestData) => {
  const video = await mediaModel.findByIdAndUpdate({ _id: requestData._id }, {
    $inc: { playCount: 1 }
  })
  return video
}
homePage.getContentPagesForCustomer = async (requestData) => {
  return await cmsModel.findOne({ _id: requestData._id, isActive: true })
}

homePage.getAllFaqs = async (requestData) => {
  return await adminCmsModel.getAllFaqs(requestData)
}

module.exports = homePage
