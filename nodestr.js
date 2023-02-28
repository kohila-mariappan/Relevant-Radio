const cryptoJS = require('crypto-js')

const encryptData = function (plainDataObject) {
  // Crypto JS Function To Encrypted the Decrypt Data.
  const encryptedData = cryptoJS.AES.encrypt(JSON.stringify(plainDataObject), '$2a$10$e.oPc.dyrwRoQCpDvO9Rhe').toString()
  console.log(encryptedData)
  return encryptedData
}

encryptData({
  user_name: 'anus.gowda.n@brainvire.com',
  password: 'india@123'
})
