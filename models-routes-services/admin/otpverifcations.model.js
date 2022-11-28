const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OTPVerifications = new Schema({
  sEmail: { type: String, required: true },
  sCode: { type: String, required: true },
  bIsVerify: { type: Boolean, default: false }
}, {
  timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' }
})
OTPVerifications.index({ sCode: 1 })

module.exports = mongoose.model('otpverifications', OTPVerifications)
