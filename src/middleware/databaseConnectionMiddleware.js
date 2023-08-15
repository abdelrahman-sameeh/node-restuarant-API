const { default: mongoose } = require('mongoose');
const asyncHandler = require('express-async-handler');
exports.connectWithDatabase = asyncHandler(async () => {
   // Connect with db
   mongoose
      .connect(process.env.DB_URL)
      .then(conn => {
         console.log('connect with database ' + conn.connection.host);
      })
      .catch(err=>console.log(err))
})