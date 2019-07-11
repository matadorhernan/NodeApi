// environmets 
require('./environments/environment')
// npm dependencies
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

// creation of express app
const app = express()

// express plugins and configurations
app.use(cors(process.env.WHITELIST))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// express routes
app.use(require('./routes/index'))

// mongoose connection to mongodb
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (error, response) => {
    if (error) {
        throw error
    }
    console.log('Server is Connected to Database');
})

// Express listen
app.listen(process.env.PORT, () => {
    console.log('Listening on Port:80, Cors is Activated')
})