const express = require('express')
const cors = require('cors')
const BodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

const app = express()

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

mongoose.connect('mongodb://localhost:27017/social', (error) => {
    if(error) console.log(error)
    else console.log('MongoDB is connected..!')
})

app.use('/account', require('./routes/user'))
app.use('/post', require('./routes/post'))

app.listen(8000)