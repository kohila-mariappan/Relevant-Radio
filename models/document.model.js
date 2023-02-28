const mongoose = require('mongoose')

const DocumentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    s3FileKey: {
      type: String,
      required: true
    },
    sharedWith: {
      type: Array
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isLatest: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)
const Document = mongoose.model('Document', DocumentSchema)
module.exports = Document
