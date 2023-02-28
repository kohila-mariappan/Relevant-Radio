const service = require('./auth-service')

module.exports = function (app) {
  // API to save user
  app.post('/admin/register', service.saveAuthUser)

  // API to login admin
  app.post('/admin/login', service.login)

  // API to send mail for forgot password
  app.post('/admin/forgot-password', service.forgotPassword)

  // API to reset password
  app.post('/admin/reset-password', service.resetPassword)

  // API to change user password
  app.put('/admin/change-password', service.changePassword)

  // API to logout user
  app.get('/admin/logout', service.logout)

  // API to list all user
  app.get('/admin/user/get', service.getAllUsers)

  // API to Get LoggedIn User List
  app.get('/admin/loggedIn/userList', service.loggedInUserList)

  // API to Get LoggedIn User Count and Avg Time
  app.get('/admin/loggedIn/userCount', service.loggedInUserCount)

  // API to Get Single LogIn User Detail
  app.get('/admin/logIn/user', service.getLoginUserDetail)
}
