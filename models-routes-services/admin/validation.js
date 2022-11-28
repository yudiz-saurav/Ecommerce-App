const { pick, removeNull, isValidEmail, isValidPassword, isValidName, isValidMobile, validMongoId, catchError } = require('../../helper/utilities.services')
const { status, messages, jsonStatus } = require('../../helper/api.responses')
const Admin = require('./model')
const ObjectId = require('mongoose').Types.ObjectId
const validators = {}

validators.addAdmin = (req, res, next) => {
  try {
    req.body = pick(req.body, ['sName', 'sEmail', 'sPassword', 'sUsername', 'sMobNum'])
    removeNull(req.body)
    const { sName, sEmail, sPassword, sUsername, sMobNum } = req.body
    if (!sEmail) return res.status(status.BadRequest).json({ message: messages.English.required.replace('##', messages.English.email) })
    if (!isValidEmail(sEmail)) return res.status(status.BadRequest).json({ message: messages.English.invalid.replace('##', messages.English.email) })
    if (!sPassword) return res.status(status.BadRequest).json({ message: messages.English.required.replace('##', messages.English.password) })
    if (!isValidPassword(sPassword)) return res.status(status.BadRequest).json({ message: messages.English.invalid.replace('##', messages.English.password) })
    if (!sName) return res.status(status.BadRequest).json({ message: messages.English.required.replace('##', messages.English.name) })
    if (!isValidName(sName)) return res.status(status.BadRequest).json({ message: messages.English.invalid.replace('##', messages.English.name) })
    if (!sMobNum) return res.status(status.BadRequest).json({ message: messages.English.required.replace('##', messages.English.mobileNumber) })
    if (!isValidMobile(sMobNum)) return res.status(status.BadRequest).json({ message: messages.English.invalid.replace('##', messages.English.mobileNumber) })
    if (!sUsername) return res.status(status.BadRequest).json({ message: messages.English.required.replace('##', messages.English.username) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

validators.login = (req, res, next) => {
  try {
    console.log('++++++' + req.language)
    req.body = pick(req.body, ['sEmail', 'sPassword'])
    removeNull(req.body)
    const { sEmail, sPassword } = req.body
    console.log('req.language login', req.language)
    if (!sPassword && !sEmail) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].emailAndPassword) })
    if (!sEmail) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].email) })
    if (!isValidEmail(sEmail)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].email) })
    if (!sPassword) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].password) })
    if (!isValidPassword(sPassword)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].password) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

validators.profile = async (req, res, next) => {
  try {
    const admin = await Admin.findOne(ObjectId(req.admin.id))
    if (!validMongoId(req.admin.id)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', 'Admin Id') })
    if (admin.eStatus === 'B') return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].admin_blocked })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

validators.update = (req, res, next) => {
  try {
    req.body = pick(req.body, ['sName', 'sMobNum'])
    removeNull(req.body)
    const { sName, sMobNum } = req.body
    if (!sName && !sMobNum) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].data_required })
    if (sName && !isValidName(sName)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalidFormat.replace('##', messages[req.language].name) })
    if (sMobNum && !isValidMobile(sMobNum)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].valid.replace('##', messages[req.language].mobileNumber) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

validators.changePassword = async (req, res, next) => {
  try {
    req.body = pick(req.body, ['sNewPassword', 'sOldPassword'])
    removeNull(req.body)
    const { sNewPassword, sOldPassword } = req.body
    if (!sOldPassword && !sNewPassword) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].oldAndNew) })
    if (!sOldPassword) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].oldPassword) })
    if (!isValidPassword(sOldPassword)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalidFormat.replace('##', messages[req.language].oldPassword) })
    if (!sNewPassword) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].newPassword) })
    if (!isValidPassword(sNewPassword)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalidFormat.replace('##', messages[req.language].newPassword) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

validators.sendOTP = async (req, res, next) => {
  try {
    req.body = pick(req.body, ['sEmail'])
    removeNull(req.body)
    const { sEmail } = req.body
    if (!sEmail) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].email) })
    if (!isValidEmail(sEmail)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].email) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

validators.verifyOTP = async (req, res, next) => {
  try {
    req.body = pick(req.body, ['sEmail', 'sCode'])
    removeNull(req.body)
    const { sEmail, sCode } = req.body
    if (!sEmail) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].email) })
    if (!sCode) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].required.replace('##', messages[req.language].otp) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}

validators.resetPassword = async (req, res, next) => {
  try {
    req.body = pick(req.body, ['sPassword'])
    removeNull(req.body)
    const { sPassword } = req.body
    if (!sPassword) return res.status(status.BadRequest).json({ message: messages.English.required.replace('##', messages.English.password) })
    if (!isValidPassword(sPassword)) return res.status(status.BadRequest).json({ message: messages.English.invalid.replace('##', messages.English.password) })
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}
module.exports = validators
