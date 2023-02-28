const mongoose = require('mongoose')

const ContentPagesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true
    },
    description: {
      type: String,
      required: true
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
const ContentPages = mongoose.model('ContentPages', ContentPagesSchema)
module.exports = ContentPages
