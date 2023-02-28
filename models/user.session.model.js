const mongoose = require('mongoose')

const UserSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['login', 'emailVerification', 'forgotPassword']
    },
    loginTime: {
      type: Date
    },
    logoutTime: {
      type: Date
    },
    isLoggedIn: {
      type: Boolean
    },
    ttl: {
      type: Date
    },
    isActive: {
      type: Boolean
    },
    verificationToken: {
      type: String
    },
    isAdmin: {
      type: Boolean
    },
    user: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userModel' }]

  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)
const UserSession = mongoose.model('UserSession', UserSessionSchema)
module.exports = UserSession
