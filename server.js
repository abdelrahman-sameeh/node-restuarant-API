const express = require('express');
const path = require('path');
const morgan = require('morgan');
const app = express();
const ApiError = require('./src/utils/ApiError');
const { globalHandleError } = require('./src/middleware/errorMiddleware');
const { connectWithDatabase } = require('./src/middleware/databaseConnectionMiddleware');
const { mountRoutes } = require('./src/routes');
require('dotenv').config()

// to use images in app
app.use('/src/uploads', express.static(path.join(__dirname, 'src', 'uploads')))

// connecting with database
connectWithDatabase()


app.use(express.json({limit: '20kb'}))


if (process.env.NODE_ENV === 'dev') {
   app.use(morgan('dev'))
}
console.log('i\'m in ' + process.env.NODE_ENV + ' mode');


// mount route
mountRoutes(app)



// handle all routes that not exist
app.all('*', (req, res, next) => {
   return next(new ApiError(`can't find this route ${req.originalUrl}`, 404));
})

// global error function
app.use(globalHandleError)


const PORT = process.env.PORT || 8000
const server = app.listen(PORT, (err) => {
   if (!err) {
      console.log('app listening on port ' + PORT)
   }
})


process.on('unhandledRejection', (err) => {
   console.error(`rejection unhandled error ${err.name} -> ${err.message}`);
   // if have a pending request => server close after end it
   server.close(() => {
      console.log('shutting down application ...');
      // close app
      process.exit(1)
   })
})