const { check } = require("express-validator");
const {
  validationResultMiddleware,
} = require("../middleware/validationResultMiddleware");
const Category = require("../model/categoryModel");

exports.createCategoryValidator = [
  check("title")
    .notEmpty()
    .withMessage("Category title is required")
    .custom(async (value) => {
      const category = await Category.findOne({ title: value });
      if (category) {
        throw "this category already exist";
      }
      return true;
    }),
  check("image").custom((value) => {
    if (!value.startsWith("Category")) {
      throw "Category image is required";
    }
    return true;
  }),
  validationResultMiddleware,
];

exports.updateCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("category id is required")
    .isMongoId()
    .withMessage("id must be a valid id")
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw `No category match this ID ${value}`;
      }
      return true;
    }),
  check("title")
    .optional()
    .notEmpty()
    .withMessage("Category title is required")
    .custom(async (value) => {
      const category = await Category.findOne({ title: value });
      if (category) {
        throw "this category already exist";
      }
      return true;
    }),
  check("image")
    .optional()
    .custom((value) => {
      if (!value.startsWith("Category")) {
        throw "Category image is required";
      }
      return true;
    }),
  validationResultMiddleware,
];


exports.deleteCategoryValidator = [
  check("id")
  .notEmpty()
  .withMessage("category id is required")
  .isMongoId()
  .withMessage("id must be a valid id")
  .custom(async (value) => {
    const category = await Category.findById(value);
    if (!category) {
      throw `No category match this ID ${value}`;
    }
    return true;
  })
]



exports.getOneCategoryValidator = [
  check("id")
  .notEmpty()
  .withMessage("category id is required")
  .isMongoId()
  .withMessage("id must be a valid id")
  .custom(async (value) => {
    const category = await Category.findById(value);
    if (!category) {
      throw `No category match this ID ${value}`;
    }
    return true;
  })
]
