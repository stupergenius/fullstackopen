const bcrypt = require('bcrypt')

const saltRounds = 8

const hashSync = data => bcrypt.hashSync(data, saltRounds)
const hash = data => bcrypt.hash(data, saltRounds)
const compareSync = (data, encrypted) => bcrypt.compareSync(data, encrypted)
const compare = (data, encrypted) => bcrypt.compare(data, encrypted)

module.exports = {
  hashSync,
  hash,
  compareSync,
  compare,
}
