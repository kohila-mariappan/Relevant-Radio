const mongoose = require('mongoose')

const FaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    sequence: {
      type: Number,
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
const Faq = mongoose.model('Faq', FaqSchema)
module.exports = Faq
