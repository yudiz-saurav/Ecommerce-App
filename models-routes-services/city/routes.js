const router = require('express').Router()
const { adminAuth } = require('../../middlewares/middleware')
const validator = require('./validation')
const cityServices = require('./services')

router.get('/city/:id', adminAuth, validator.validateId, cityServices.getStatesCity)
router.post('/city/addCity/:id', adminAuth, validator.addCity, cityServices.addCity)
router.put('/city/updateCity/:id', adminAuth, validator.updateCity, cityServices.updateCity)
router.patch('/city/deleteCity/:id', adminAuth, validator.deleteCity, cityServices.deleteCity)

module.exports = router
