const State = require('./model')
const City = require('../city/model')
const { status, jsonStatus, messages } = require('../../helper/api.responses')
const { pick, slug, catchError } = require('../../helper/utilities.services')

class States {
  async addState (req, res) {
    try {
      req.body = pick(req.body, ['sName'])
      const { sName } = req.body
      const stateName = slug(sName)
      const stateExist = await State.findOne({ sSlug: stateName })
      if (stateExist) return res.status(status.BadRequest).json({ status: status.BadRequest, message: messages.English.exist.replace('##', sName) })
      const state = await State.create({ sName, sSlug: stateName })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].add_success.replace('##', messages[req.language].state), data: { state } })
    } catch (error) {
      catchError('state.addState', error, req, res)
    }
  }

  async stateList (req, res) {
    try {
      const { start = 1, limit = 10, sorting = 1, search } = req.query
      let query = {
        bIsDeleted: { $ne: true }
      }
      const findSlug = slug(search)
      query = findSlug ? { ...query, sName: { $regex: new RegExp('^.*' + findSlug + '.*', 'i') } } : query
      const totalState = await State.countDocuments({ bIsDeleted: { $ne: true } }).lean()
      const startIndex = (start - 1) * limit
      const states = await State.find(query).sort(sorting).skip(Number(startIndex)).limit(Number(limit)).lean()
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].fetch_succ, date: { states, stateCount: totalState } })
    } catch (error) {
      catchError('state.listState', error, req, res)
    }
  }

  async updateState (req, res) {
    try {
      req.body = pick(req.body, ['sName'])
      const { id } = req.params
      const { sName } = req.body
      const stateExist = await State.findOne({ _id: { $ne: id }, sSlug: slug(sName) }).lean()
      if (stateExist) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].exist.replace('##', messages[req.language].state) })
      await State.findByIdAndUpdate({ _id: id }, { sName, sSlug: slug(sName) })
      res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].update_success.replace('##', messages[req.language].state) })
    } catch (error) {
      return catchError('state.updateState', error, req, res)
    }
  }

  async deleteState (req, res) {
    try {
      const { id } = req.params
      const state = await State.findByIdAndUpdate({ _id: id }, { bIsDeleted: true }).lean()
      await City.updateMany({ iState: state._id }, { bIsDeleted: true })
      if (state.bIsDeleted === true) { return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].not_exist.replace('##', messages[req.language].state) }) }
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].deleted.replace('##', messages[req.language].state), data: { state } })
    } catch (error) {
      catchError('state.deleteState', error, req, res)
    }
  }
}

module.exports = new States()
