const { pick, removeNull, isValidName, catchError, validMongoId } = require('../../helper/utilities.services')
const { status, messages, jsonStatus } = require('../../helper/api.responses')

const validators = {}

validators.addState = (req, res, next) => {
  try {
    req.body = pick(req.body, ['sName'])
    removeNull(req.body)
    const { sName } = req.body
    if (!sName) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].state_name) })
    if (sName && !sName.trim()) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].state_name) })
    if (!isValidName(sName)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].state_name) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

validators.stateList = (req, res, next) => {
  try {
    const { start, limit, sorting } = req.query
    if (start && start <= 0) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].value_greater_zero.replace('##', messages[req.language].start) })
    if (limit && limit <= 0) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].value_greater_zero.replace('##', messages[req.language].limit) })
    if (sorting && (sorting !== 1 || -1)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].value_equal.replace('##', messages[req.language].sorting) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

validators.update = (req, res, next) => {
  try {
    req.body = pick(req.body, ['sName'])
    removeNull(req.body)
    const { id } = req.params
    const { sName } = req.body
    if (!validMongoId(id)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].state) })
    if (!sName) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].data_required })
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
