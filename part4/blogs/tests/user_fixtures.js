const listWithManyUsers = [
  {
    username: 'hellas',
    password: 'asd;lfkasdl;fjk',
    name: 'Arto Hellas',
  },
  {
    username: 'mluukkai',
    password: 'qwpeoirqwupoe',
    name: 'Matti Luukkainen',
  },
  {
    username: 'bsnider',
    password: 'zx,.cvmz.vcm,n',
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
