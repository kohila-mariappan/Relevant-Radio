const mongoose = require('mongoose')

const ContactUsSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    lastName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    email: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 255
    },
    countryCode: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 4
    },
    mobile: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 20
    },
    message: {
      type: String,
      required: false,
      maxLength: 255
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

const ContactUs = mongoose.model('ContactUs', ContactUsSchema)
module.exports = ContactUs
