module.exports = function (app) {
  require('../modules/web/user/index')(app)
  require('../modules/admin/auth/index')(app)
  require('../modules/web/home-page/index')(app)
  require('../modules/admin/cms/index')(app)
  require('../modules/admin/video-upload/index')(app)
  require('../modules/web/files/index')(app)
}
