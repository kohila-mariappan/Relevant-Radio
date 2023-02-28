const constants = require('../../../utils/constants')
const mediaModel = require('../../../models/media.model')
const fileUploadService = require('../../../utils/fileStorage')

/**
 * @description video upload api's
 * @module admin - video upload
 */
const video = function () {}

video.videoUpload = async (requestData) => {
  if ((requestData.file.size / 1024 / 1024).toFixed() > 50) {
    throw new Error(constants.errorMessage.en.msg_video_size)
  }
  return fileUploadService.fileUpload(requestData)
}

video.saveVideoDetails = async (requestData) => {
  const count = await mediaModel.count({ isActive: true })
  if (count > 10) {
    requestData.body.isActive = false
  }

  const mediaSequence = await mediaModel.findOne({ sequence: requestData.body.sequence })
  if (mediaSequence?._id) {
    throw new Error(constants.errorMessage.en.msg_sequence_error)
  }
  requestData.body.userId = requestData.userId
  requestData.body.created_by = requestData.userId
  requestData.body.updated_by = requestData.userId
  requestData.body.mediaType = constants.mediaType.video
  requestData.body.playCount = 0
  const video = new mediaModel(requestData.body)
  await video.save()
  return {
    _id: video._id
  }
}

video.getVideoDetails = async (requestData) => {
  const { search, isActive, fromDate, toDate } = requestData

  let page = requestData.page
  const size = requestData.size || 30

  const sort = requestData.sort || 'sequence'
  const order = requestData.order || 'asc'
  const sortOrder = {}

  const query = { mediaType: constants.mediaType.video }
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

  if (fromDate && toDate) {
    const startDate = new Date(fromDate)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(toDate)
    endDate.setHours(23, 59, 59, 999)
    query.created_at = { $gte: new Date(startDate), $lte: new Date(endDate) }
  }

  if (!page || page <= 0) {
    page = 1
  }

  sortOrder[sort] = order === 'desc' ? -1 : 1

  const start = (page - 1) * size

  const mediaList = await mediaModel.aggregate([
    { $match: query },
    { $skip: parseInt(start) },
    { $limit: parseInt(size) },
    { $sort: sortOrder }
  ])
  const count = await mediaModel.count(query)

  const videoListData = []
  let url
  let thumb
  for (const x of mediaList) {
    thumb = await fileUploadService.getSingedUrl(x.thumbnail)
    if (x.s3FileKey !== undefined) {
      url = await fileUploadService.getSingedUrl(x.s3FileKey)
      videoListData.push({ ...x, s3FileKey: url, thumbnail: thumb })
    } else {
      videoListData.push({ ...x, thumbnail: thumb })
    }
  }

  return { result: videoListData, totalCount: count }
}

video.updateVideoDetails = async (requestData) => {
  const oldVideo = await mediaModel.findOne({ _id: requestData.body.id })

  const mediaSequence = await mediaModel.findOne({ sequence: requestData.body.sequence })

  if (mediaSequence !== null && mediaSequence._id.toString() !== requestData.body.id) {
    await mediaModel.updateOne(
      { _id: oldVideo._id },
      {
        sequence: requestData.body.sequence,
        updatedAt: new Date()
      }
    )
    await mediaModel.updateOne(
      { _id: mediaSequence._id },
      {
        sequence: oldVideo.sequence,
        updatedAt: new Date()
      }
    )
  }

  const video = await mediaModel.findOneAndUpdate({ _id: requestData.body.id }, {
    $set: requestData.body
  })
  if (!video) {
    throw new Error(constants.errorMessage.en.msg_no_content_exist)
  }

  const key = []

  if (requestData.body.thumbnail || requestData.body.s3FileKey) {
    if (requestData.body.thumbnail) {
      key.push({ Key: video.thumbnail })
    }

    if (requestData.body.s3FileKey) {
      key.push({ Key: video.s3FileKey })
    }
    await fileUploadService.deleteMultipleFile(key)
  }
  return {
    _id: video._id
  }
}

video.updateVideoStatus = async (requestData) => {
  const video = await mediaModel.findOneAndUpdate({ _id: requestData.id }, {
    isActive: requestData.isActive,
    updated_by: requestData.userId
  })
  if (!video) {
    throw new Error(constants.errorMessage.en.msg_no_content_exist)
  }
  return {
    _id: video._id
  }
}

video.deleteVideo = async (requestData) => {
  const video = await mediaModel.findOne({ _id: requestData.id })

  if (!video) {
    throw new Error(constants.errorMessage.en.msg_video_not_exist)
  }
  const key = [
    {
      Key: video.thumbnail
    }
  ]

  if (video.s3FileKey) {
    key.push({ Key: video.s3FileKey })
  }

  await fileUploadService.deleteMultipleFile(key)

  await mediaModel.findOneAndDelete({ _id: requestData.id })
  return constants.successMessage.en.msg_video_delete
}

video.deleteS3Video = async (requestData) => {
  return await fileUploadService.deleteFile(requestData.key)
}

video.getVideoById = async (requestData) => {
  const media = await mediaModel.findOne({ _id: requestData._id }).lean()
  let url
  const thumb = await fileUploadService.getSingedUrl(media.thumbnail)
  if (media.s3FileKey !== undefined) {
    url = await fileUploadService.getSingedUrl(media.s3FileKey)
    return { ...media, s3UrlKey: media.s3FileKey, s3FileKey: url, thumbnailKey: media.thumbnail, thumbnail: thumb }
  } else {
    return { ...media, thumbnailKey: media.thumbnail, thumbnail: thumb }
  }
}
module.exports = video
