const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors');
const cors = require('cors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const errorHandler = require('./middleware/error')
const mongoSanitize = require('express-mongo-sanitize')
const connectDB = require('./config/db')


dotenv.config({ path: './config/config.env'});


connectDB()
// Router files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses')
const auth = require('./routes/auth');
const users = require('./routes/users')
const reviews = require('./routes/reviews')


const app = express();


app.use(express.json())

// coolie parser
app.use(cookieParser())

app.use(helmet())

app.use(xss())

app.use(cors())

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max:100
})

app.use(limiter)

app.use(hpp())

// dev logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// file uploading
app.use(fileupload())

app.use(mongoSanitize())

// set static foler
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)



app.use(errorHandler)


const PORT = process.env.PORT || 5000;
const server = app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

// Handle unhandled rejections

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message} `.red)
    // Close server and exit
    server.close(() => process.exit(1))
})