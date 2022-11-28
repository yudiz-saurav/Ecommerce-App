const ShopModel = require('./model')
const CityModel = require('../city/model')
const { status, jsonStatus, messages } = require('../../helper/api.responses')
const { pick, catchError, slug } = require('../../helper/utilities.services')

class Shops {
  async addShop (req, res) {
    try {
      req.body = pick(req.body, ['sName', 'sAddress', 'sPincode', 'sEmail', 'sMobNum', 'nRating', 'sBusinessHrs', 'sImageUrl', 'iCityId', 'iStateId'])
      const { sName, sAddress, sPincode, sEmail, sMobNum, nRating, sBusinessHrs, sImageUrl, iCityId, iStateId } = req.body
      const shopExist = await ShopModel.findOne({ sSlug: slug(sName) })
      if (shopExist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].exist.replace('##', messages[req.userLanguage].shop) })
      const city = await CityModel.findOne({ _id: iCityId })
      const data = new ShopModel({
        sName,
        sSlug: slug(sName),
        sAddress,
        sPincode,
        sEmail,
        sMobNum,
        nRating,
        iCity: iCityId,
        iState: iStateId,
        sBusinessHrs,
        sImageUrl

      })
      city.iShop.push(data._id)
      await city.save()
      await data.save()
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.language].add_success.replace('##', messages[req.language].shop), data })
    } catch (error) {
      catchError('Shop.addShop', error, req, res)
    }
  }

  async shopList (req, res) {
    try {
      const { start = 1, limit = 10, sorting = 1 } = req.query
      const { iStateId, iCityId } = req.params
      const startIndex = (start - 1) * limit
      const shops = await ShopModel.find({ iCity: iCityId, iState: iStateId, bIsDeleted: { $ne: true } }).sort(sorting).skip(Number(startIndex)).limit(Number(limit)).lean()
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].fetch_succ, date: { shops } })
    } catch (error) {
      catchError('shop.shopList', error, req, res)
    }
  }

  async updateShop (req, res) {
    try {
      req.body = pick(req.body, ['sName', 'sAddress', 'sEmail', 'sMobNum', 'nRating'])
      const { sName, sAddress, sEmail, sMobNum, nRating } = req.body
      const { iCityId, iStateId } = req.params
      const shopExist = await ShopModel.findOne({ sSlug: slug(sName) }).lean()
      const shop = await ShopModel.findOne({ iCity: iCityId, iState: iStateId }).lean()
      if (cityExist && !cityExist._id.equals(city._id)) {
        return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].exist.replace('##', messages[req.language].city) })
      }
      if (cityExist && cityExist._id.equals(city._id) && cityExist.bIsDeleted === true) {
        return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].update_failure.replace('##', messages[req.language].city) })
      }
      if (shop.bIsDeleted === true) {
        return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.language].update_failure.replace('##', messages[req.language].city) })
      }
      await ShopModel.findByIdAndUpdate({ _id: id }, { sName, sSlug: slug(sName) })
      res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.language].update_success.replace('##', messages[req.language].city) })
    } catch (error) {
      return catchError('Shop.updateShop', error, req, res)
    }
  }
}

module.exports = new Shops()
