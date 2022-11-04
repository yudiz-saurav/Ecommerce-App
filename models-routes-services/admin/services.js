const Admin = require('./model')
const { pick, catchError, encodeToken, hash } = require('../../helper/utilities.services')
const { status, jsonStatus, messages } = require('../../helper/api.responses')
const bcrypt = require('bcrypt')

class Admins {
  async addAdmin (req, res) {
    try {
      const { sName, sUsername, sEmail, sMobNum, sPassword } = req.body
      const pass = await hash(sPassword)
      const admin = new Admin({
        sName,
        sUsername,
        sEmail,
        sMobNum,
        sPassword: pass
      })
      await admin.save()
      console.log('add success' + messages.English.add_success)
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages.English.add_success.replace('##', messages.English.admin) })
    } catch (error) {
      catchError('admin.register', error, req, res)
    }
  }

  async login (req, res) {
    try {
      req.body = pick(req.body, ['sEmail', 'sPassword'])
      const { sEmail, sPassword } = req.body
      const admin = await Admin.findOne({ sEmail, eStatus: { $ne: 'D' } })
      if (!admin || admin.eStatus === 'B') return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.language].not_found.replace('##', messages[req.language].admin) })

      if (await bcrypt.compare(sPassword, admin.sPassword)) {
        const newToken = {
          sToken: encodeToken({ id: admin._id, role: 'admin' }, 30000)
        }
        if (admin.aJwtTokens.length < 3) {
          admin.aJwtTokens.push(newToken)
        } else {
          admin.aJwtTokens.splice(0, 1)
          admin.aJwtTokens.push(newToken)
        }
        await admin.save()
        const adminData = {
          _id: admin._id,
          sName: admin.sName,
          sUsername: admin.sUsername,
          sEmail: admin.sEmail,
          sMobNum: admin.sMobNum
        }
        return res.status(status.OK).set('Authorization', newToken.sToken).json({
          status: jsonStatus.OK,
          message: messages.succ_login,
          data: adminData
        })
      } else {
        return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].auth_failed })
      }
    } catch (error) {
      catchError('admin.login', error, req, res)
    }
  }

  async profile (req, res) {
    try {
      const admin = await Admin.findById(req.admin.id).lean()
      const adminData = {
        _id: admin._id,
        sName: admin.sName,
        sUsername: admin.sUsername,
        sEmail: admin.sEmail,
        sMobNum: admin.sMobNum
      }
      return res.status(status.OK).json({ status: jsonStatus.OK, data: adminData })
    } catch (error) {
      catchError('admin.profile', error, req, res)
    }
  }

  async update (req, res) {
    try {
      req.body = pick(req.body, ['sName', 'sMobNum'])
      await Admin.updateOne({ _id: req.admin.id }, { ...req.body }).lean()
      res.status(status.Create).json({ status: jsonStatus.OK, message: messages[req.language].update_success.replace('##', messages[req.language].admin) })
    } catch (error) {
      return catchError('admin.update', error, req, res)
    }
  }

  async changePassword (req, res) {
    try {
      const admin = await Admin.findById({ _id: req.admin.id }).lean()
      req.body = pick(req.body, ['sNewPassword', 'sOldPassword'])
      const { sNewPassword, sOldPassword } = req.body
      if (await bcrypt.compare(sOldPassword, admin.sPassword)) {
        const pass = await hash(sNewPassword)
        await Admin.updateOne({ _id: admin._id }, { sPassword: pass }).lean()
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].update_success.replace('##', messages[req.language].password) })
      } else {
        return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].invalid.replace('##', messages[req.language].oldPassword) })
      }
    } catch (error) {
      catchError('admin.resetPassword', error, req, res)
    }
  }

  async logout (req, res) {
    try {
      await Admin.updateOne({ _id: req.admin.id }, { $pull: { aJwtTokens: { sToken: req.header('Authorization') } } }).lean()
      return res.status(status.OK).json({
        status: jsonStatus.OK,
        message: 'Logout Successful '
      })
    } catch (error) {
      return catchError('AdminAuth.logout', error, req, res)
    }
  }
}

module.exports = new Admins()
