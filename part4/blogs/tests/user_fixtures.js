const blogFixtures = require('./blog_fixtures')

const listWithManyUsers = [
  {
    username: 'hellas',
    password: 'asd;lfkasdl;fjk',
    name: 'Arto Hellas',
    blogs: blogFixtures.listWithManyBlogs.slice(0, 2).map(b => b._id),
  },
  {
    username: 'mluukkai',
    password: 'qwpeoirqwupoe',
    name: 'Matti Luukkainen',
    blogs: blogFixtures.listWithManyBlogs.slice(2, 3).map(b => b._id),
  },
  {
    username: 'bsnider',
    password: 'zx,.cvmz.vcm,n',
    name: 'Benjamin Snider',
    blogs: blogFixtures.listWithManyBlogs.slice(3, 4).map(b => b._id),
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
