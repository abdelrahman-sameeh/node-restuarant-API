const express = require('express');
const path = require('path');
const morgan = require('morgan');
const app = express();
const ApiError = require('./src/utils/ApiError');
const { globalHandleError } = require('./src/middleware/errorMiddleware');
const { connectWithDatabase } = require('./src/middleware/databaseConnectionMiddleware');
require('dotenv').config()


app.use('/src/uploads', express.static(path.join(__dirname, 'src', 'uploads')))



connectWithDatabase()

app.use(express.json())


if (process.env.NODE_ENV === 'dev') {
   app.use(morgan('dev'))
}
console.log('i\'m in ' + process.env.NODE_ENV + ' mode');




const authRoute = require('./src/routes/authRoute')
const productRoute = require('./src/routes/productRoute')
const userRoute = require('./src/routes/userRoute')
const cartRoute = require('./src/routes/cartRoute')


app.use('/api/v1', authRoute)
app.use('/api/v1', productRoute)
app.use('/api/v1', userRoute)
app.use('/api/v1', cartRoute)



app.all('*', (req, res, next) => {
   return next(new ApiError(`can't find this route ${req.originalUrl}`, 404));
})




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