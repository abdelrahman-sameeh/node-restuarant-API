const { default: mongoose } = require("mongoose");

const cartSchema = mongoose.Schema({
   cartItems: [
      {
         product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Products'
         },
         count: Number,
         price: Number
      }
   ],
   total: Number,
   totalAfterDiscount: Number,
   user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
   }
})


cartSchema.pre(/^find/, function (next) {
   this.populate({ path: 'user', select: 'name email' })
   next()
})


const Cart = mongoose.model('Cart', cartSchema)


module.exports = Cart;