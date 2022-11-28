const mongoose = require('mongoose')
const Schema = mongoose.Schema
const City = new Schema({
  sName: {
    type: String,
    required: true
  },
  iState: {
    type: Schema.Types.ObjectId,
    ref: 'states'
  },
  sSlug: {
    type: String
  },
  iShop: [{
    type: String,
    ref: 'shops'
  }],
  bIsDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'dcreatedAt', updatedAt: 'dUpdatedAt' }
})
City.index({ sName: 1, sSlug: 1 })
module.exports = mongoose.model('cities', City)
