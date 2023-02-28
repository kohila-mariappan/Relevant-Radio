const service = require('./user-service')

module.exports = function (app) {
  // API to save user
  app.post('/register', service.saveUser)

  // API to Send Email Verification Mail To User
  app.post('/send-verification-mail', service.sendEmailVerificationLink)

  // API to verify user email
  app.get('/verify-email', service.emailVerify)

  // API to login user
  app.post('/login', service.login)

  // API to send mail for forgot password
  app.post('/forgot-password', service.forgotPassword)

  // API to reset password
  app.post('/reset-password', service.resetPassword)

  // API to change user password
  app.put('/change-password', service.changePassword)

  // API to logout user
  app.get('/logout', service.logout)

  // API to save user address
  app.post('/address/add', service.saveAddress)

  // API to update user address
  app.put('/address/update', service.updateAddress)

  // API to delete user address
  app.delete('/address/delete', service.deleteAddress)

  // API to get user address details
  app.get('/address/get', service.getAllAddress)

  // internal api to encrypt body
  app.post('/encrypt', service.encryptBody)

  // API to Update User Profile
  app.put('/profile/update', service.updateProfile)

  // API to Get User Profile Details
  app.get('/profile/get', service.getProfile)
}
