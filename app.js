require('dotenv').config()
const express = require('express')
const cors = require('cors')
const notFound = require('./middlewares/notFound')
const errorMiddleware = require('./middlewares/error')
const authRoute = require('./routes/auth-route')
const bakeryname = require('./routes/bekery-route')
const app = express()
const path = require("path")

app.use(cors())
app.use(express.json())

// service
app.use('/auth', authRoute)

app.use('/bekery', bakeryname)

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

//notfound
app.use( notFound )

//error
app.use(errorMiddleware)

let port = process.env.PORT || 8000
app.listen(port, ()=> console.log('Server on Port :', port))
