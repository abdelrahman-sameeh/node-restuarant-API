const { check } = require("express-validator");
const {
  validationResultMiddleware,
} = require("../middleware/validationResultMiddleware");
const Category = require("../model/categoryModel");
const Meal = require("../model/mealModel");

exports.createMealValidator = [
  check("title")
    .notEmpty()
    .withMessage("Meal title is required")
    .isLength({ min: 3 })
    .withMessage("Too short Meal title")
    .isLength({ max: 30 })
    .withMessage("Too long Meal title"),
  check("details")
    .notEmpty()
    .withMessage("details is required")
    .isLength({ min: 5 })
    .withMessage("Too short Meal details"),
  check("size").custom((value) => {
    let sizes = ["small", "medium", "large"];
    if (Array.isArray(value)) {
      value.forEach((size) => {
        if (!sizes.includes(size)) {
          throw `Size must be one of these sizes ( ${sizes.join(", ")} )`;
        }
      });
    } else {
      if (!sizes.includes(value)) {
        throw `Size must be one of these sizes ( ${sizes.join(", ")} )`;
      }
    }
    return true;
  }),
  check("price").notEmpty().withMessage("Price is required"),
  check("category")
    .notEmpty()
    .withMessage("category is required")
    .isMongoId()
    .withMessage("Enter a category valid ID")
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw `No category match this ID => ${value}`;
      }
      return true;
    }),
  validationResultMiddleware,
];

exports.updateMealValidator = [
  check("title")
    .optional()
    .notEmpty()
    .withMessage("Meal title is required")
    .isLength({ min: 3 })
    .withMessage("Too short Meal title")
    .isLength({ max: 30 })
    .withMessage("Too long Meal title"),
  check("details")
    .optional()
    .notEmpty()
    .withMessage("details is required")
    .isLength({ min: 5 })
    .withMessage("Too short Meal details"),
  check("size")
    .optional()
    .custom((value) => {
      let sizes = ["small", "medium", "large"];
      if (Array.isArray(value)) {
        value.forEach((size) => {
          if (!sizes.includes(size)) {
            throw `Size must be one of these sizes ( ${sizes.join(", ")} )`;
          }
        });
      } else {
        if (!sizes.includes(value)) {
          throw `Size must be one of these sizes ( ${sizes.join(", ")} )`;
        }
      }
      return true;
    }),
  check("price").optional().notEmpty().withMessage("Price is required"),
  check("category")
    .optional()
    .notEmpty()
    .withMessage("category is required")
    .isMongoId()
    .withMessage("Enter a category valid ID")
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw `No category match this ID => ${value}`;
      }
      return true;
    }),
  validationResultMiddleware,
];

exports.checkMealIDValidator = [
  check("id")
    .notEmpty()
    .withMessage("Enter a Meal ID")
    .isMongoId()
    .withMessage("Enter a valid ID")
    .custom(async (value) => {
      const meal = await Meal.findById(value);
      if (!meal) {
        throw `No Meal match this ID => ${value}`;
      }
    }),
];
