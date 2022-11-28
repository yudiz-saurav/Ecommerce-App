module.exports = (app) => {
  app.use('/api', [
    require('../models-routes-services/admin/routes'),
    require('../models-routes-services/user/routes'),
    require('../models-routes-services/state/routes'),
    require('../models-routes-services/city/routes'),
    require('../models-routes-services/shop/routes')
  ])
}
