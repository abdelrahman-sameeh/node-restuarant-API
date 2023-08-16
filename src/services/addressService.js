const expressAsyncHandler = require("express-async-handler");
const Address = require("../model/addressModel");
const handleFactory = require("./handleFactory");
const ApiError = require("../utils/ApiError");



// @desc    get list of addresses
// @route   GET  /api/v1/address
// @access  private => admin
exports.getAllAddresses = handleFactory.getListOfItems(Address, 'address');


// @desc    create one address
// @route   POST  /api/v1/address
// @access  private => user
exports.addNewAddress = expressAsyncHandler(async (req, res, next) => {
   const address = await Address.create({ ...req.body, user: req.user._id });
   if (!address) {
      return next(new ApiError('Failed to add address', 400));
   }
   res.status(200).json(address)
})


// @desc    get one address
// @route   GET  /api/v1/address/:id
// @access  private => (user, admin)
exports.getAddress = handleFactory.getOneItem(Address, 'address')


// @desc    update one address
// @route   PUT  /api/v1/address/:id
// @access  private => (user, admin)
exports.updateAddress = handleFactory.updateOneItem(Address, 'address')


// @desc    delete one address
// @route   DELETE  /api/v1/address/:id
// @access  private => (user, admin)
exports.deleteAddress = handleFactory.deleteOneItem(Address, 'address')
