const yaml = require('js-yaml')
const fs = require('fs')

module.exports = {
  config: () => {
    // The .env file will take precedence over the settings the env_variables.yaml file
    require('dotenv').config()

    const isObject = obj => typeof obj === 'object'

    const fileContents = fs.readFileSync('env_variables.yaml', 'utf8')
    const doc = yaml.safeLoad(fileContents, { json: true })

    if (isObject(doc) && isObject(doc.env_variables)) {
      Object.keys(doc.env_variables).forEach(function (key) {
        // Dont set environment with the yaml file value if it's already set
        process.env[key] = process.env[key] || doc.env_variables[key]
      })
    }
  }
}
