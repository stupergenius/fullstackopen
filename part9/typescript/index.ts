import express from 'express'

const app = express()

app.use('/hello', (_, res) => {
  res.send('Hello Full Stack!')
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
