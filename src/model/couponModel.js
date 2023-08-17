const { default: mongoose } = require("mongoose");

const couponSchema = mongoose.Schema({
   name: {
      type: String,
      minLength: [2, 'Too short coupon title'],
      maxLength: [30, 'Too long coupon title'],
      required: [true, 'coupon name is required'],
      trim: true
   },
   expire: {
      type: Date,
      required: [true, 'coupon expire date is required'],
   },
   discount: {
      type: Number,
      required: [true, 'coupon discount is required']
   }

}, { timestamps: true })


const Coupon = mongoose.model('Coupon', couponSchema)


module.exports = Coupon;