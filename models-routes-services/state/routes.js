const router = require('express').Router()
const { adminAuth } = require('../../middlewares/middleware')
const validator = require('./validation')
const stateServices = require('./services')

router.get('/state/list', adminAuth, validator.stateList, stateServices.stateList)
router.post('/state/addState', adminAuth, validator.addState, stateServices.addState)
router.put('/state/updateState/:id', adminAuth, validator.update, stateServices.updateState)
router.patch('/state/deleteState/:id', adminAuth, validator.validateId, stateServices.deleteState)
module.exports = router
