const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  addReview,
  getListOfReviews,
  getOneReview,
  updateOneReview,
  deleteOneReview,
  setFilterInBody,
} = require("../services/reviewService");

const AuthService = require("../services/authService");
const { setUserIdInBody } = require("../services/utility");
const {
  addReviewValidator,
  updateReviewValidator,
  checkId,
} = require("../validator/reviewValidator");

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowTo("user"),
    setUserIdInBody,
    addReviewValidator,
    addReview,
  )
  .get(setFilterInBody, getListOfReviews);

router
  .route("/:id")
  .get(checkId, getOneReview)
  .put(
    AuthService.protect,
    AuthService.allowTo("user"),
    setUserIdInBody,
    checkId,
    updateReviewValidator,
    updateOneReview,
  )
  .delete(
    AuthService.protect,
    AuthService.allowTo("user", "admin"),
    checkId,
    deleteOneReview,
  );

module.exports = router;
