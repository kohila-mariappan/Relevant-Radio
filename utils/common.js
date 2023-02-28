const _ = require('lodash')
const constants = require('./constants')
const jwt = require('jsonwebtoken')
const config = require('../configurations/config')
const logger = require('../utils/logger')
const util = require('util')
const CryptoJS = require('crypto-js')
/**
 * This function will remove all the fields which is not included in schema.
 *
 * @param object
 *            data object
 * @param schema
 *            schema for the object to compare fields
 */
const sanitize = function (object, schema, modelName, moduleName) {
  const schemaKeys = _.keys(schema.properties)
  const objectKeys = _.keys(object)
  const constantsValues = _.values(constants.keys)

  for (const key in objectKeys) {
    let isValueMatched = false
    for (const index in constantsValues) {
      if (constantsValues[index].indexOf(objectKeys[key].substring(0, constantsValues[index].length)) === 0) {
        isValueMatched = true
        break
      }
    }
    if (!isValueMatched && schemaKeys.indexOf(objectKeys[key]) === -1) {
      delete object[objectKeys[key]]
    } else {
      const propertyList = _.keys(schema.properties[objectKeys[key]])
      for (let index = 0; index < propertyList.length; index++) {
        if (propertyList[index] === '$ref') {
          const refValue = schema.properties[objectKeys[key]]
          let schemas = {}
          if (moduleName.toLowerCase() === 'admin') {
            schemas = require('../modules/admin/' + modelName + '/' + modelName + '-schema')
          } else if (moduleName.toLowerCase() === 'customers') {
            schemas = require('../modules/customers/' + modelName + '/' + modelName + '-schema')
          } else {
            schemas = require('../modules/suppliers/' + modelName + '/' + modelName + '-schema')
          }
          const refSchema = refValue.$ref.substring(1, refValue.$ref.length)
          sanitize(object[objectKeys[key]], schemas[refSchema])
        }
      }
    }
  }
  return object
}

const signPayload = function async (payload) {
  try {
    const secretKey = config.get('JWT_TOKEN.SECRET')
    const expireIn = config.get('JWT_TOKEN.expireTime')
    const accessToken = jwt.sign(payload, secretKey, {
      expiresIn: expireIn
    })
    return {
      expiresIn: expireIn,
      accessToken
    }
  } catch (error) {
    logger.error(util.format('Error while Generating the JWT Token: ', '. Error: %j', error))
    throw new Error(error)
  }
}

const decryptData = function async (data) {
  try {
    const decryptData = CryptoJS.AES.decrypt(data, config.get('SECRET_KEY'))
    const loginData = decryptData.toString(CryptoJS.enc.Utf8)
    return JSON.parse(loginData)
  } catch (error) {
    logger.error(util.format('Error while decrypting the data : ', '. Error: %j', error))
    throw new Error(error)
  }
}

const toPascalCase = function async (string) {
  return string.replace(/(\w)(\w*)/g,
    function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase() })
}

module.exports = {
  sanitize,
  signPayload,
  decryptData,
  toPascalCase
}
