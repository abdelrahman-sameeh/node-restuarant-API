const expressAsyncHandler = require("express-async-handler");
const Meal = require("../model/mealModel");
const multer = require("multer");
const handleFactory = require("./handleFactory");
const ApiError = require("../utils/ApiError");


exports.uploadSingleImage = (fieldName, dist) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `src/uploads/${dist}`);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${dist}-${uniqueSuffix}-${file.originalname}`);
    },
  });
  const upload = multer({ storage: storage });
  return upload.single(fieldName);
};



// @desc      create one Meal
// @route     POST  /api/v1/meals
// @access    protected ==> admin
exports.createMeal = expressAsyncHandler(async (req, res, next) => {
  const meal = await Meal.create(req.body);
  
  return res.status(201).json({
    data: meal,
  });
});


// @desc      update one Meal
// @route     PUT  /api/v1/meals/:id
// @access    protected ==> admin
exports.updateOneMeal = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const response = await Meal.findByIdAndUpdate(id, req.body, { new: true });

  if (!response) {
    return next(
      new ApiError("something went wrong, try again in another time", 400)
    );
  }

  res.status(200).json({
    data: response,
  });
});

// @desc      get list of Meal
// @route     GET  /api/v1/meals
// @access    public
exports.getListOfMeals = handleFactory.getListOfItems(Meal, "Meal");

// @desc      get one Meal
// @route     DELETE  /api/v1/meals/:id
// @access    public
exports.getOneMeal = handleFactory.getOneItem(Meal, "Meal");

// @desc      delete one Meal
// @route     DELETE  /api/v1/meals/:id
// @access    protected ==> admin
exports.deleteOneMeal = handleFactory.deleteOneItem(Meal, "Meal");
