
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors');
const connectDB = require('./config/db')


dotenv.config({ path: './config/config.env'});


connectDB()
// Router files
const bootcamps = require('./routes/bootcamps');


const app = express();


app.use(express.json())


// dev logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


app.use('/api/v1/bootcamps', bootcamps)


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