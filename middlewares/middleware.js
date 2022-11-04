const { catchError, decodeToken } = require('../helper/utilities.services')
const { status } = require('../helper/api.responses')
require('dotenv').config()

const adminAuth = (req, res, next) => {
  if (!req.header('Authorization')) {
    return res
      .status(status.Unauthorized)
  }
  try {
    const token = decodeToken(req.header('Authorization'))
    if (token === 'jwt expired') {
      return res
        .status(status.Forbidden)
    }
    if (token.role !== 'admin') {
      return res
        .status(status.Unauthorized)
    }
    req.admin = token
    req.language = req.header('language') || 'English'
    next()
  } catch (error) {
    return catchError('adminAuth', error, req, res)
  }
}

const setLanguage = (req, res, next) => {
  try {
    req.language = req.header('language') || 'English'
    next()
  } catch (error) {
    return catchError('set Language', error, req, res)
  }
}

module.exports = { adminAuth, setLanguage }
