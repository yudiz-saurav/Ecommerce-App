const mongoose = require('mongoose')
const Schema = mongoose.Schema
const State = new Schema({
  sName: {
    type: String,
    require: true
  },
  iCity: [{
    type: Schema.Types.ObjectId,
    ref: 'cities'
  }],
  sSlug: {
    type: String
  },
  bIsDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' }
})
State.index({ sName: 1, sSlug: 1 })
module.exports = mongoose.model('states', State)
