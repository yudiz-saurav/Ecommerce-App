const router = require('express').Router()
const { adminAuth } = require('../../middlewares/middleware')
const validator = require('./validation')
const shopServices = require('./services')

router.post('/shop/addShop', adminAuth, validator.addShop, shopServices.addShop)
router.get('/shop/shopList/:stateId/:cityId', adminAuth, validator.shopList, shopServices.shopList)
router.post('/shop/updateShop/:stateId/:cityId', adminAuth, shopServices.updateShop)
module.exports = router
