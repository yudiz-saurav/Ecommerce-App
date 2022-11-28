const { pick, removeNull, isValidName, catchError, validMongoId, isValidEmail, isValidMobile } = require('../../helper/utilities.services')
const { status, messages, jsonStatus } = require('../../helper/api.responses')

const validators = {}
validators.addShop = (req, res, next) => {
  try {
    req.body = pick(req.body, ['sName', 'sAddress', 'sPincode', 'sEmail', 'sMobNum', 'nRating', 'sBusinessHrs', 'sImageUrl', 'iProduct'])
    removeNull(req.body)
    const { sName, sAddress, sPincode, sEmail, sMobNum, nRating, sBusinessHrs } = req.body
    const { cityId, stateId } = req.params
    if (!validMongoId(cityId)) return res.status(status.BadRequest).json({ message: messages[req.language].invalid.replace('##', messages[req.language].city) })
    if (!validMongoId(stateId)) return res.status(status.BadRequest).json({ message: messages[req.language].invalid.replace('##', messages[req.language].state) })
    if (!sName) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].shop_name) })
    if (sName && !sName.trim()) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].shop_name) })
    if (!isValidName(sName)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].shop_name) })
    if (!sPincode) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].shop_name) })
    if (!sEmail) return res.status(status.BadRequest).json({ message: messages.English.required.replace('##', messages.English.email) })
    if (!isValidEmail(sEmail)) return res.status(status.BadRequest).json({ message: messages.English.invalid.replace('##', messages[req.language].email) })
    if (!sMobNum) return res.status(status.BadRequest).json({ message: messages[req.language].required.replace('##', messages[req.language].mobileNumber) })
    if (!isValidMobile(sMobNum)) return res.status(status.BadRequest).json({ message: messages[req.language].invalid.replace('##', messages[req.language].mobileNumber) })
    if (!nRating) return res.status(status.BadRequest).json({ message: messages[req.language].required.replace('##', messages[req.language].rating) })
    if (!sBusinessHrs) return res.status(status.BadRequest).json({ message: messages[req.language].required.replace('##', messages[req.language].businessHrs) })
    if (!sAddress) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].address) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

validators.shopList = (req, res, next) => {
  try {
    const { start, limit, sorting } = req.query
    const { stateId, cityId } = req.params
    if (!stateId) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].not_found.replace('##', messages[req.language].state) })
    if (!validMongoId(stateId)) return res.status(status.BadRequest).json({ message: messages[req.language].invalid.replace('##', messages[req.language].state) })
    if (!cityId) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].not_found.replace('##', messages[req.language].city) })
    if (!validMongoId(cityId)) return res.status(status.BadRequest).json({ message: messages[req.language].invalid.replace('##', messages[req.language].city) })
    if (start && start <= 0) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].value_greater_zero.replace('##', messages[req.language].start) })
    if (limit && limit <= 0) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].value_greater_zero.replace('##', messages[req.language].limit) })
    if (sorting && (sorting !== 1 || -1)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].value_equal.replace('##', messages[req.language].sorting) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

module.exports = validators
