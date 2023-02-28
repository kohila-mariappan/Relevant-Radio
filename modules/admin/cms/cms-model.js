const userModel = require('../../../models/user.model')
const constants = require('../../../utils/constants')
const cmsModel = require('../../../models/cms.model')
const faqModel = require('../../../models/faq.model')

/**
 * @description cms api's
 * @module admin - cms
 */
const cms = function () {}

cms.saveContentPages = async (requestData) => {
  const user = await userModel.findOne({ _id: requestData.userId })
  if (!user) {
    throw new Error(constants.errorMessage.en.msg_user_not_found)
  }
  requestData.body.created_by = requestData.userId
  requestData.body.updated_by = requestData.userId
  const cms = new cmsModel(requestData.body)
  await cms.save()
  return {
    _id: cms._id
  }
}

cms.getContentPagesForCustomer = async (requestData) => {
  return await cmsModel.findOne({ _id: requestData._id })
}

cms.getAllContentPages = async (requestData) => {
  const { search, isActive } = requestData

  let page = requestData.page
  const size = requestData.size || 30

  const sort = requestData.sort || 'created_at'
  const order = requestData.order || 'desc'
  const sortOrder = {}

  const query = { }
  const searchFields = ['title', 'description']

  if (search && search.length > 0) {
    const searchList = search.match(/("[^"]+"|[^"\s]+)/g)
    const queryList = []
    searchList.forEach((search) => {
      searchFields.forEach((searchField) => {
        const qry = {}
        qry[searchField] = { $regex: search, $options: 'i' }
        queryList.push(qry)
      })
    })

    query.$or = queryList
  }

  if (isActive && isActive.length > 0) {
    query.isActive = JSON.parse(isActive)
  }

  if (!page || page <= 0) {
    page = 1
  }

  sortOrder[sort] = order === 'desc' ? -1 : 1

  const start = (page - 1) * size

  const cmsList = await cmsModel.aggregate([
    { $match: query },
    { $skip: parseInt(start) },
    { $limit: parseInt(size) },
    { $sort: sortOrder }
  ])
  const cmsCount = await cmsModel.count(query)
  return { result: cmsList, totalCount: cmsCount }
}

cms.updateContentPages = async (requestData) => {
  const contentPage = await cmsModel.findOneAndUpdate({ _id: requestData.body.id }, {
    description: requestData.body.description,
    updated_by: requestData.userId
  })
  if (!contentPage) {
    throw new Error(constants.errorMessage.en.msg_no_content_exist)
  }
  return {
    _id: contentPage._id
  }
}

cms.updateCmsStatus = async (requestData) => {
  console.log(requestData)
  const contentPage = await cmsModel.findOneAndUpdate({ _id: requestData.id }, {
    isActive: requestData.isActive,
    updated_by: requestData.userId
  })
  if (!contentPage) {
    throw new Error(constants.errorMessage.en.msg_no_content_exist)
  }
  return {
    _id: contentPage._id
  }
}

// faq APIs

cms.saveFaq = async (requestData) => {
  const user = await userModel.findOne({ _id: requestData.userId })
  if (!user) {
    throw new Error(constants.errorMessage.en.msg_user_not_found)
  }
  const faqSequence = await faqModel.findOne({ sequence: requestData.body.sequence })
  if (faqSequence?._id) {
    throw new Error(constants.errorMessage.en.msg_sequence_error)
  }
  requestData.body.created_by = requestData.userId
  requestData.body.updated_by = requestData.userId
  const faq = new faqModel(requestData.body)
  await faq.save()
  return {
    _id: faq._id
  }
}

cms.getAllFaqs = async (requestData) => {
  const { search, isActive } = requestData

  let page = requestData.page
  const size = requestData.size || 30

  const sort = requestData.sort || 'sequence'
  const order = requestData.order || 'asc'
  const sortOrder = {}

  const query = { }
  const searchFields = ['question', 'answer']

  if (search && search.length > 0) {
    const searchList = search.match(/("[^"]+"|[^"\s]+)/g)
    const queryList = []
    searchList.forEach((search) => {
      searchFields.forEach((searchField) => {
        const qry = {}
        qry[searchField] = { $regex: search, $options: 'i' }
        queryList.push(qry)
      })
    })

    query.$or = queryList
  }

  if (isActive && isActive.length > 0) {
    query.isActive = JSON.parse(isActive)
  }

  if (!page || page <= 0) {
    page = 1
  }

  sortOrder[sort] = order === 'desc' ? -1 : 1

  const start = (page - 1) * size

  const faqList = await faqModel.aggregate([
    { $match: query },
    { $skip: parseInt(start) },
    { $limit: parseInt(size) },
    { $sort: sortOrder }
  ])
  const faqCount = await faqModel.count(query)
  return { result: faqList, totalCount: faqCount }
}

cms.updateFaq = async (requestData) => {
  const oldFaq = await faqModel.findOne({ _id: requestData.body.id })

  const faqSequence = await faqModel.findOne({ sequence: requestData.body.sequence })

  if (faqSequence !== null && faqSequence._id.toString() !== requestData.body.id) {
    await faqModel.updateOne(
      { _id: oldFaq._id },
      {
        sequence: requestData.body.sequence,
        updatedAt: new Date()
      }
    )
    await faqModel.updateOne(
      { _id: faqSequence._id },
      {
        sequence: oldFaq.sequence,
        updatedAt: new Date()
      }
    )
  }

  const faq = await faqModel.findOneAndUpdate({ _id: requestData.body.id }, {
    question: requestData.body.question,
    answer: requestData.body.answer,
    sequence: requestData.body.sequence,
    updated_by: requestData.userId
  })
  if (!faq) {
    throw new Error(constants.errorMessage.en.msg_no_faq_exist)
  }
  return {
    _id: faq._id
  }
}

cms.updateFaqStatus = async (requestData) => {
  const faq = await faqModel.findOneAndUpdate({ _id: requestData.id }, {
    isActive: requestData.isActive,
    updated_by: requestData.userId
  })
  if (!faq) {
    throw new Error(constants.errorMessage.en.msg_no_faq_exist)
  }
  return {
    _id: faq._id
  }
}

cms.getFaqById = async (requestData) => {
  return await faqModel.findOne({ _id: requestData._id })
}
module.exports = cms
