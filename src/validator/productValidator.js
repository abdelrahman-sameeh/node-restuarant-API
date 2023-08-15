const { check } = require("express-validator");
const { validationResultMiddleware } = require("../middleware/validationResultMiddleware");

exports.createProductValidator = [
   check('title')
      .notEmpty().withMessage('product title is required')
      .isLength({ min: 3 }).withMessage('Too short product title')
      .isLength({ max: 30 }).withMessage('Too long product title'),
   check('details')
      .notEmpty().withMessage('details is required')
      .isLength({ min: 5 }).withMessage('Too short product details'),
   check('size')
      .custom((value) => {
         let sizes = ['small', 'medium', 'large'];
         value.forEach(size => {
            if (!sizes.includes(size)) {
               throw `Size must be one of these sizes ( ${sizes.join(', ')} )`
            }
         })
         return true
      }),
   validationResultMiddleware
]

exports.updateProductValidator = [
   check('title')
      .optional()
      .notEmpty().withMessage('product title is required')
      .isLength({ min: 3 }).withMessage('Too short product title')
      .isLength({ max: 30 }).withMessage('Too long product title'),
   check('details')
      .optional()
      .notEmpty().withMessage('details is required')
      .isLength({ min: 5 }).withMessage('Too short product details'),
   check('size')
      .optional()
      .custom((value) => {
         let sizes = ['small', 'medium', 'large'];
         value.forEach(size => {
            if (!sizes.includes(size)) {
               throw `Size must be one of these sizes ( ${sizes.join(', ')} )`
            }
         })
         return true
      }),
   validationResultMiddleware
]