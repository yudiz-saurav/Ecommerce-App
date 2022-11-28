const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Shop = new Schema({
  sName: {
    type: String,
    requied: true
  },
  sSlug: {
    type: String
  },
  sAddress: {
    type: String,
    required: true
  },
  sPincode: {
    type: String,
    required: true
  },
  sEmail: {
    type: String,
    required: true
  },
  sMobNum: {
    type: String,
    required: true
  },
  nRating: {
    type: String,
    required: true
  },
  iCity: {
    type: String
  },
  iState: {
    type: String
  },
  sBusinessHrs: {
    type: String,
    required: true
  },
  bIsDeleted: {
    type: Boolean,
    default: false
  },
  sImageUrl: {
    type: String,
    default: ''
  },
  iProduct: [{
    type: Schema.Types.ObjectId,
    ref: 'products'
  }]
}, {
  timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' }
})

Shop.index({ sName: 1, iCity: 1, iState: 1 })
module.exports = mongoose.model('shops', Shop)
