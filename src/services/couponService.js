
const Coupon = require('../model/couponModel');
const handleFactory = require('./handleFactory');


// @desc      create one Coupon
// @route     POST  /api/v1/coupon
// @access    protected ==> admin
exports.createCoupon = handleFactory.createItem(Coupon, 'Coupon')


// @desc      update one Coupon
// @route     PUT  /api/v1/coupon/:id
// @access    protected ==> admin
exports.updateOneCoupon = handleFactory.updateOneItem(Coupon, 'Coupon')


// @desc      get list of Coupon
// @route     GET  /api/v1/coupon
// @access    public
exports.getListOfCoupons = handleFactory.getListOfItems(Coupon, 'Coupon');


// @desc      get one Coupon
// @route     DELETE  /api/v1/coupon/:id
// @access    public
exports.getOneCoupon = handleFactory.getOneItem(Coupon, 'Coupon')


// @desc      delete one Coupon
// @route     DELETE  /api/v1/coupon/:id
// @access    protected ==> admin
exports.deleteOneCoupon = handleFactory.deleteOneItem(Coupon, 'Coupon')



