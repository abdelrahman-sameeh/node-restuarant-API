const expressAsyncHandler = require("express-async-handler")
const User = require("../model/userModel");


// @desc      add one product into favorites
// @route     PUT  /api/v1/addProductToFavorite/:id
// @params    {id: id from product}
// @access    private => user
exports.addProductToFavorite = expressAsyncHandler(async (req, res, next) => {
   const { id } = req.params

   const response = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { favorites: id } },
      { new: true }
   )

   res.status(200).json({
      data: response
   })
})

// @desc      remove one product into favorites
// @route     GET  /api/v1/deleteProductFromFavorite/:id
// @params    {id: id from product}
// @access    private => user
exports.deleteProductFromFavorite = expressAsyncHandler(async (req, res, next) => {
   const { id } = req.params
   const response = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: id } },
      { new: true }
   )
   res.status(200).json({
      data: response
   })
})

// @desc      get logged user
// @route     GET  /api/v1/user
// @access    public
exports.getLoggedUser = expressAsyncHandler(async (req, res, next) => {
   const response = await User.findById(req.user._id);
   res.status(200).json({
      data: response
   })
})