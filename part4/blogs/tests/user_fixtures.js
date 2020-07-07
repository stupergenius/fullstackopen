const listWithManyUsers = [
  {
    username: 'hellas',
    name: 'Arto Hellas',
  },
  {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
  },
  {
    username: 'bsnider',
    name: 'Benjamin Snider',
  },
]

const factory = () => ({
  username: 'newuser1',
  password: 'asdf',
  name: 'New Userton',
})

module.exports = {
  factory,
  listWithManyUsers,
}
