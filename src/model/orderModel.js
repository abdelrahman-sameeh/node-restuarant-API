const { default: mongoose } = require("mongoose");

const orderSchema = mongoose.Schema({
   user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
   },
   orderItems: [
      {
         product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            price: Number,
            count: Number
         },
         count: Number,
         size: {
            type: String,
            enum: ['small', 'medium', 'large']
         }
      }
   ],
   totalPrice: Number,
   address: {
      type: mongoose.Schema.ObjectId,
      ref: 'Address'
   },
   shippingPrice: {
      type: Number,
      default: 0
   },
   orderStatus: {
      type: String,
      default: 'new',
      enum: ['new', 'inProgress', 'inDeliver', 'completed']
   },
   deliveryMethod: {
      type: Boolean,
      default: true,
   },
   isDelivered: {
      type: Boolean,
      default: false
   },
   deliveredAt: Date,
   paidMethod: {
      type: String,
      default: 'cash',
      enum: ['cash', 'card']
   },
   isPaid: {
      type: Boolean,
      default: false,
   },
   paidAt: Date,

}, { timestamps: true })


orderSchema.pre(/^find/, function (next) {
   this.populate({ path: 'address', select: 'city phone -user' })
      .populate({ path: 'user', select: 'name email' })
      .populate({ path: 'orderItems.product', select: 'title price' })

   next()
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
