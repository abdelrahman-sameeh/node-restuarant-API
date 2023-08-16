const { check } = require("express-validator");
const Address = require("../model/addressModel");
const { validationResultMiddleware } = require("../middleware/validationResultMiddleware");

exports.createOrderValidator = [
   // 1- check the address exist
   check('address')
      .isMongoId().withMessage('Address Id must be valid')
      .custom(async(value, {req})=>{
         const address = await Address.findOne({_id: value, user: req.user._id})
         if(!address){
            throw 'No address match this ID'
         }
         return true
      }),
      validationResultMiddleware
]