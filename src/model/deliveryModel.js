const { default: mongoose } = require("mongoose");

const deliverySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
  },
},{ timestamps: true });


deliverySchema.pre(/^find/, function(next){
  this.populate({path: 'order'})
  next()
})

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;
