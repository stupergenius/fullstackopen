const envData = {
  development: {
    baseUrl: 'http://localhost:3001/api',
  },
  production: {
    baseUrl: 'https://fullstackopen-phonebook.ue.r.appspot.com/api',
  },
}

export default {
  config: (name) => {
    const env = envData[process.env.NODE_ENV] || envData.development
    return env[name]
  },
}
