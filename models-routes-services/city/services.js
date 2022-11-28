const City = require('./model')
const { status, jsonStatus, messages } = require('../../helper/api.responses')
const { pick, catchError, slug } = require('../../helper/utilities.services')
const State = require('../state/model')
const { default: mongoose } = require('mongoose')

async function removeCity (id, session) {
  try {
    const city = await City.findOne({ _id: id }).lean()
    if (!city) { return { status: false, statusCode: status.BadRequest, message: messages.English.not_exist.replace('##', messages.English.city) } }
    if (city.bIsDeleted === true) { return { status: false, statusCode: status.BadRequest, message: messages.English.not_exist.replace('##', messages.English.city) } }
    await City.findByIdAndUpdate({ _id: id }, { bIsDeleted: true }, { session }).lean()
    return { status: true, statusCode: status.OK, message: messages.English.update_success.replace('##', messages.English.city) }
  } catch (error) {
    catchError('city.removeCity', error)
  }
}

async function removeCityState (id, session) {
  try {
    const city = await City.findOne({ _id: id }).lean()
    const state = await State.findOne({ _id: city.iState })
    if (!state) { return { status: false, statusCode: status.BadRequest, message: messages.English.not_exist.replace('##', messages.English.state) } }
    if (state.bIsDeleted === true) { return { status: false, statusCode: status.BadRequest, message: messages.English.not_exist.replace('##', messages.English.state) } }
    await State.findByIdAndUpdate({ _id: city.iState }, { $pull: { iCity: city._id } }, { session }).lean()
    return { status: true, statusCode: status.OK, message: messages.English.update_success.replace('##', messages.English.city) }
  } catch (error) {
    catchError('city.removeCityState', error)
  }
}

class Cities {
  async addCity (req, res) {
    try {
      req.body = pick(req.body, ['sName'])
      const { sName } = req.body
      const { id } = req.params
      const state = await State.findOne({ _id: id })
      if (!state) { return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].not_exist.replace('##', messages[req.language].state) }) }
      const cityName = slug(sName)
      const cityExist = await City.findOne({ sSlug: cityName })
      if (cityExist) return res.status(status.BadRequest).json({ status: status.BadRequest, message: messages.English.exist.replace('##', sName) })
      const city = await City.create({ sName, sSlug: cityName, iState: id })
      state.iCity.push(city._id)
      await state.save()
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].add_success.replace('##', messages[req.language].city) })
    } catch (error) {
      catchError('city.addCity', error, req, res)
    }
  }

  async getStatesCity (req, res) {
    try {
      const { id } = req.params
      const state = await State.findOne({ _id: id }).populate('iCity').lean()
      if (state.bIsDeleted === true) { return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].not_exist.replace('##', messages[req.language].state) }) }
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].fetch_succ, date: { state } })
    } catch (error) {
      catchError('state.listState', error, req, res)
    }
  }

  async updateCity (req, res) {
    try {
      req.body = pick(req.body, ['sName', 'stateId'])
      const { sName, stateId } = req.body
      const { id } = req.params
      const stateExist = await State.findOne({ _id: stateId }).lean()
      if (stateExist) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].exist.replace('##', messages[req.language].city) })
      const cityExist = await City.findOne({ _id: { $ne: id }, sSlug: slug(sName) }).lean()
      if (cityExist) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].exist.replace('##', messages[req.language].city) })
      await City.findByIdAndUpdate({ _id: id }, { sName, sSlug: slug(sName) })
      res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].update_success.replace('##', messages[req.language].city) })
    } catch (error) {
      return catchError('city.updateCity', error, req, res)
    }
  }

  async deleteCity (req, res) {
    const session = await mongoose.startSession()
    try {
      session.startTransaction()
      const { id } = req.params
      const deleteResult = await Promise.all([removeCity(id, session), removeCityState(id, session)])
      const failedTxns = deleteResult.filter((result) => result.status !== true)
      if (failedTxns.length) {
        const errors = failedTxns.map(a => a.message)
        await session.abortTransaction()
        return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: errors })
      }
      await session.commitTransaction()
      session.endSession()
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].deleted.replace('##', messages[req.language].city) })
    } catch (error) {
      catchError('city.deleteCity', error, req, res)
    }
  }
}

module.exports = new Cities()
