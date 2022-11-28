const router = require('express').Router()
const adminServices = require('./services')
const { adminAuth, setLanguage } = require('../../middlewares/middleware')
const validator = require('./validation')

router.get('/admin/profile', adminAuth, validator.profile, adminServices.profile)
router.post('/admin/login', setLanguage, validator.login, adminServices.login)
router.post('/admin/addAdmin', validator.addAdmin, adminServices.addAdmin)
router.post('/admin/sendOTP', validator.sendOTP, adminServices.sendOTP)
router.post('/admin/verifyOTP', validator.verifyOTP, adminServices.verifyOTP)
router.post('/admin/resetPassword/:email', validator.resetPassword, adminServices.resetPassword)
router.put('/admin/updateAdmin', adminAuth, validator.update, adminServices.update)
router.put('/admin/changePassword', adminAuth, validator.changePassword, adminServices.changePassword)
router.post('/admin/logout', setLanguage, adminAuth, adminServices.logout)

module.exports = router
