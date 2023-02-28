const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// const AddressSchema = new mongoose.Schema(
//   {
//     addressLine1: {
//       type: String,
//       required: true,
//       minLength: 1,
//       maxLength: 100
//     },
//     addressLine2: {
//       type: String,
//       required: true,
//       minLength: 1,
//       maxLength: 100
//     },
//     mobile: {
//       type: String,
//       required: true,
//       minLength: 1,
//       maxLength: 13
//     },
//     country: {
//       type: String,
//       required: true,
//       minLength: 1,
//       maxLength: 50
//     },
//     state: {
//       type: String,
//       required: true,
//       minLength: 1,
//       maxLength: 50
//     },
//     city: {
//       type: String,
//       required: true,
//       minLength: 1,
//       maxLength: 50
//     },
//     zipCode: {
//       type: Number,
//       required: true,
//       minLength: 1,
//       maxLength: 10
//     }
//   },
//   {
//     timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
//   }
// )

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    dob: {
      type: Date,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      message: '{VALUE} is not supported',
      default: 'user'
    },
    accessToken: {
      type: String
    },
    address: {
      type: Array
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

// mongoose.HookNextFunction
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }
    const hashed = await bcrypt.hash(this.password, 10)
    this.password = hashed
    return next()
  } catch (err) {
    return next(err)
  }
})
const User = mongoose.model('User', UserSchema)
module.exports = User
