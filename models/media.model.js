const mongoose = require('mongoose')

const MediaSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    mediaType: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    thumbnail: {
      type: String
    },
    s3FileKey: {
      type: String
    },
    sequence: {
      type: Number,
      required: true
    },
    url: {
      type: String
    },
    playCount: {
      type: Number
    },
    isActive: {
      type: Boolean,
      default: true
    },
    created_by: {
      type: String
    },
    updated_by: {
      type: String
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)
const Media = mongoose.model('Media', MediaSchema)
module.exports = Media
