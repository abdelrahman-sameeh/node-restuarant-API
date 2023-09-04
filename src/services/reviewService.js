const handleFactory = require("./handleFactory");
const Review = require("../model/reviewModel");
const expressAsyncHandler = require("express-async-handler");
const Meal = require("../model/mealModel");

exports.setFilterInBody = (req, res, next) => {
  let filter = {};
  if (req.params.mealId) {
    filter.meal = req.params.mealId;
  }
  req.body.filter = filter;
  next();
};

const calcRatingAvg = (reviews) => {
  if (reviews.length) {
    let result = reviews
      .map((review) => review.rating)
      .reduce((curr, acc) => curr + acc);
    return result / reviews.length;
  }
};

exports.addReview = expressAsyncHandler(async (req, res, next) => {
  const response = await Review.create(req.body);

  // update rating avg
  const reviews = await Review.find({ meal: req.body.meal });
  const ratingAvg = calcRatingAvg(reviews);
  const ratingQty = reviews.length;
  await Meal.findByIdAndUpdate(req.body.meal, { ratingAvg, ratingQty });

  res.status(201).json({
    data: response,
  });
});

exports.getListOfReviews = handleFactory.getListOfItems(Review, "review");

exports.getOneReview = handleFactory.getOneItem(Review, "review");

exports.updateOneReview = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.file && req.file.filename) {
    req.body.image = req.file.filename;
  }
  const response = await Review.findByIdAndUpdate(id, req.body, { new: true });
  if (!response) {
    return next(new ApiError(`no review matches this id => ${id}`, 404));
  }

  // update rating review
  const reviews = await Review.find({ meal: response.meal });
  const ratingAvg = calcRatingAvg(reviews);
  const ratingQty = reviews.length;
  await Meal.findByIdAndUpdate(response.meal, { ratingAvg, ratingQty });

  res.status(200).json({
    msg: `Review updated successfully`,
    data: response,
  });
});

exports.deleteOneReview = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const response = await Review.findByIdAndDelete(id);
  if (!response) {
    return next(new ApiError(`no review matches this id => ${id}`, 404));
  }

  // update rating review
  const reviews = await Review.find({ meal: response.meal });
  const ratingAvg = calcRatingAvg(reviews);
  const ratingQty = reviews.length;
  await Meal.findByIdAndUpdate(response.meal, { ratingAvg, ratingQty });

  res.status(200).json({
    msg: `Review Deleted successfully`,
  });
});
