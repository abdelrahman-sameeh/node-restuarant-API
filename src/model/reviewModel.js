const { default: mongoose } = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      min: [1, "Minimum rating must be equal 1"],
      max: [5, "Maximum rating must be equal 5"],
    },
    title: String,
    meal: {
      type: mongoose.Schema.ObjectId,
      ref: "Meal",
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next()
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
