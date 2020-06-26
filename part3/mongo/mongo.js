const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

const exit = (code) => {
  mongoose.connection.close()
  process.exit(code || 0)
}

const errorHandler = e => {
  console.log(e)
  exit(1)
}

const usage = () => {
  console.log('Please provide at least the database password as an argument: node mongo.js <password> [<name> <number>]')
  exit(1)
}

const createPerson = ({name, number}) => {
  const person = new Person({name, number})
  person.save()
    .then(result => {
      console.log(`added ${name} number ${number} to phonebook`)
      exit()
    })
    .catch(e => {
      console.log('error adding person to phonebook')
      errorHandler(e)
    })
}

const listPersons = () => {
  console.log('phonebook:')

  Person.find({})
    .then(results => {
      for (const person of results) {
        console.log(`${person.name} ${person.number}`)
      }
      
      exit()
    })
    .catch(errorHandler)
}

const runCmd = () => {
  if (process.argv.length === 5) {
    createPerson({name: process.argv[3], number: process.argv[4]})
  } else if (process.argv.length === 3) {
    listPersons()
  } else {
    usage()
  }
}

const main = () => {
  if (process.argv.length < 3) {
    usage()
  }

  const password = process.argv[2]
  const url = `mongodb+srv://phonebook-app:${password}@cluster0-9kbla.gcp.mongodb.net/phonebook-app?retryWrites=true&w=majority`
  mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(runCmd)
    .catch(errorHandler)
}

main()
