const router = require('express').Router()
const userServices = require('./services')
const { adminAuth } = require('../../middlewares/middleware')
const validator = require('./validation')

router.get('/user/list', validator.list, adminAuth, userServices.list)
router.get('/user/status/:id', validator.status, adminAuth, userServices.status)
router.get('/user/detail/:id', validator.validId, adminAuth, userServices.detail)
router.patch('/user/delete/:id', validator.validId, adminAuth, userServices.delete)

module.exports = router
