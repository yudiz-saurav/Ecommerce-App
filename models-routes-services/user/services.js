const Admin = require('../admin/model')
const { pick, catchError } = require('../../helper/utilities.services')
const { status, jsonStatus, messages } = require('../../helper/api.responses')

class Users {
  async list (req, res) {
    try {
      const { start = 1, limit = 10, sorting = 1, estatus, search, fromDate, toDate } = req.query
      const dateFilter = fromDate && toDate ? { $gte: (fromDate), $lte: (toDate) } : {}
      let query = {
        eStatus: { $ne: 'D' }
      }
      const projection = {
        sName: 1,
        sUsername: 1,
        sEmail: 1,
        sMobNum: 1,
        eStatus: 1,
        eType: 1,
        dCreatedAt: 1
      }
      query = search ? { ...query, $or: [{ sUsername: { $regex: new RegExp('^.*' + search + '.*', 'i') } }, { sEmail: { $regex: new RegExp('^.*' + search + '.*', 'i') } }, { sMobNum: { $regex: new RegExp('^.*' + search + '.*', 'i') } }] } : query
      query = search && fromDate && toDate ? { ...query, $or: [{ sUsername: { $regex: new RegExp('^.*' + search + '.*', 'i') } }, { sEmail: { $regex: new RegExp('^.*' + search + '.*', 'i') } }, { sMobNum: { $regex: new RegExp('^.*' + search + '.*', 'i') } }], dCreatedAt: dateFilter } : query
      query = search && fromDate && toDate && estatus ? { ...query, $or: [{ sUsername: { $regex: new RegExp('^.*' + search + '.*', 'i') } }, { sEmail: { $regex: new RegExp('^.*' + search + '.*', 'i') } }, { sMobNum: { $regex: new RegExp('^.*' + search + '.*', 'i') } }], dCreatedAt: dateFilter, eStatus: estatus } : query
      query = fromDate && toDate ? { ...query, dCreatedAt: dateFilter } : query
      query = search && estatus ? { ...query, $or: [{ sUsername: { $regex: new RegExp('^.*' + search + '.*', 'i') } }, { sEmail: { $regex: new RegExp('^.*' + search + '.*', 'i') } }, { sMobNum: { $regex: new RegExp('^.*' + search + '.*', 'i') } }], eStatus: estatus } : query
      query = estatus ? { ...query, eStatus: estatus } : query
      const startIndex = (start - 1) * limit
      // use countdocuments

      const totalUser = await Admin.countDocuments().lean()
      const users = await Admin.find(query, projection).sort(sorting).skip(Number(startIndex)).limit(Number(limit)).lean()
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].user_fetch_succ, data: { users, usersCount: totalUser } })
    } catch (error) {
      catchError('User.list', error, req, res)
    }
  }

  async status (req, res) {
    try {
      req.body = pick(req.body, ['eStatus'])
      const { eStatus } = req.body
      const { id } = req.params
      const user = await Admin.findOne({ _id: id }).lean()
      if (eStatus === 'D') { return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].opertn_not_prfm }) }
      if (eStatus === 'B' && user.eStatus === 'B') return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].user_fetch_succ, data: { user } })
      if (eStatus === 'Y' && user.eStatus === 'Y') { return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].user_status.replace('##', messages[req.language].active) }) }
      await Admin.findByIdAndUpdate({ _id: id }, { eStatus }).lean()
      const stats = {
        B: 'Blocked',
        Y: 'Activated'
      }
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].success_user.replace('##', stats[eStatus]) })
    } catch (error) {
      catchError('user.status', error, req, res)
    }
  }

  async detail (req, res) {
    try {
      const { id } = req.params
      const user = await Admin.findOne({ _id: id }, { _id: 1, sName: 1, sUsername: 1, sEmail: 1, sMobNum: 1 }).lean()
      if (user.eStatus !== ('Y' || 'B')) { return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].not_found.replace('##', messages[req.language].user) }) }
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].user_fetch_succ, data: { user } })
    } catch (error) {
      catchError('user.detail', error, req, res)
    }
  }

  async delete (req, res) {
    try {
      const { id } = req.params
      const user = await Admin.findOne({ _id: id }).lean()
      if (user.eStatus === 'D') { return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].not_exist.replace('##', messages[req.language].user) }) }
      await Admin.findByIdAndUpdate({ _id: id }, { eStatus: 'D' }).lean()
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].deleted.replace('##', messages[req.language].user) })
    } catch (error) {
      catchError('user.detail', error, req, res)
    }
  }
}

module.exports = new Users()
