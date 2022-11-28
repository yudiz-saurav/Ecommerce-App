const { pick, removeNull, validMongoId, isValidStatus, isValidName, catchError } = require('../../helper/utilities.services')
const { status, messages, jsonStatus } = require('../../helper/api.responses')

const validators = {}

validators.list = async (req, res, next) => {
  try {
    req.params = pick(req.params, ['search', 'estatus'])
    removeNull(req.params)
    const { search, estatus } = req.params
    console.log('estatus', estatus)
    if (search && !isValidName(search)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].valid.replace('##', messages[req.language].text) })
    console.log('++++++', isValidStatus('F'))
    if (estatus && !isValidStatus(estatus)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].stats_valid.replace('##', messages[req.language].status) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}
validators.status = async (req, res, next) => {
  try {
    req.body = pick(req.body, ['eStatus'])
    removeNull(req.body)
    const { eStatus } = req.body
    const { id } = req.params
    if (!validMongoId(id)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].user) })
    if (!eStatus) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].user_stats) })
    console.log('++++++', isValidStatus(eStatus))
    if (!isValidStatus(eStatus)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].stats_valid.replace('##', messages[req.language].user_stats) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

validators.validId = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!validMongoId(id)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].user) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}
module.exports = validators
