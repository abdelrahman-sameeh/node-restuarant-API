exports.mountRoutes = (app) => {
   const authRoute = require('./authRoute')
   const productRoute = require('./productRoute')
   const userRoute = require('./userRoute')
   const cartRoute = require('./cartRoute')
   const addressRoute = require('./addressRoute')
   const orderRoute = require('./orderRoute')


   app.use('/api/v1', authRoute)
   app.use('/api/v1', productRoute)
   app.use('/api/v1', userRoute)
   app.use('/api/v1', cartRoute)
   app.use('/api/v1', addressRoute)
   app.use('/api/v1', orderRoute)
}