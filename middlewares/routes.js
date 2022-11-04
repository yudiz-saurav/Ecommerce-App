module.exports = (app) => {
  app.use('/api', [
    require('../models-routes-services/admin/routes')
  ])
}
