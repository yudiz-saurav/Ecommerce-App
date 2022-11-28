const mongoose = require('mongoose')
const Schema = mongoose.Schema
const data = require('../../data')

const User = new Schema({
  sFirstName: {
    type: String,
    trim: true,
    required: true
  },
  sLastName: {
    type: String,
    trim: true,
    required: true
  },
  sEmail: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  sMobNum: {
    type: String,
    trim: true,
    required: true
  },
  sPassword: {
    type: String,
    trim: true,
    required: true
  },
  eGender: {
    type: String,
    default: 'M',
    enum: data.gender
  },
  eStatus: {
    type: String,
    default: 'Y',
    enum: data.userStatus
  },
  aJwtTokens: [{
    sToken: { type: String },
    dTimeStamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' }
})
User.index({ sEmail: 1, eStatus: 1 })

module.exports = mongoose.model('users', User)
