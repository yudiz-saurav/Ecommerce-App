const { pick, removeNull, isValidName, catchError, validMongoId } = require('../../helper/utilities.services')
const { status, messages, jsonStatus } = require('../../helper/api.responses')

const validators = {}
validators.addCity = (req, res, next) => {
  try {
    req.body = pick(req.body, ['sName'])
    removeNull(req.body)
    const { sName } = req.body
    const { id } = req.params
    if (!sName) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].city_name) })
    if (sName && !sName.trim()) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].city_name) })
    if (!isValidName(sName)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].city_name) })
    if (!validMongoId(id)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].state) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

validators.updateCity = (req, res, next) => {
  try {
    req.body = pick(req.body, ['sName'])
    removeNull(req.body)
    const { id } = req.params
    const { sName } = req.body
    if (!validMongoId(id)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].state) })
    if (sName && !isValidName(sName)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalidFormat.replace('##', messages[req.language].city) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

validators.deleteCity = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!validMongoId(id)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].city) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

validators.validateId = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!validMongoId(id)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].state) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

module.exports = validators
