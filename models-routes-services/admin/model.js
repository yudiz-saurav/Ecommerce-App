const mongoose = require('mongoose')
const Schema = mongoose.Schema
const data = require('../../data')

const Admin = new Schema({
  sName: {
    type: String,
    trim: true,
    required: true
  },
  sUsername: {
    type: String,
    trim: true,
    required: true,
    unique: true
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
  eType: {
    type: String,
    default: 'SUB',
    enum: data.adminType
  },
  eStatus: {
    type: String,
    default: 'Y',
    enum: data.adminStatus
  },
  aJwtTokens: [{
    sToken: { type: String },
    dTimeStamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' }
})
Admin.index({ sEmail: 1, sUsername: 1 })

module.exports = mongoose.model('admins', Admin)
