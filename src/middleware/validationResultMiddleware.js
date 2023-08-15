const expressAsyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

exports.validationResultMiddleware = expressAsyncHandler(async (req, res, next) => {
   const result = validationResult(req);
   if (!result.isEmpty()) {
      return res.status(400).json({error: result.array()})
   }
   next()
})