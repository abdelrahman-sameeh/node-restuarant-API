const expressAsyncHandler = require("express-async-handler");
const Product = require("../model/productModel");
const multer = require("multer");
const handleFactory = require("./handleFactory");
const ApiError = require("../utils/ApiError");


exports.uploadSingleImage = (fieldName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "src/uploads/products");
      // cb(null, "/products");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `product-${uniqueSuffix}-${file.originalname}`);
    },
  });
  const upload = multer({ storage: storage });
  return upload.single(fieldName);
};



// @desc      create one product
// @route     POST  /api/v1/products
// @access    protected ==> admin
exports.createProduct = expressAsyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.filename;
  }
  const product = await Product.create(req.body);
  return res.status(201).json({
    data: product,
  });
});


// @desc      update one product
// @route     PUT  /api/v1/products/:id
// @access    protected ==> admin
exports.updateOneProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    req.body.image = req.file.filename;
  }
  const response = await Product.findByIdAndUpdate(id, req.body, { new: true });

  if (!response) {
    return next(
      new ApiError("something went wrong, try again in another time", 400)
    );
  }

  res.status(200).json({
    data: response,
  });
});

// @desc      get list of product
// @route     GET  /api/v1/products
// @access    public
exports.getListOfProducts = handleFactory.getListOfItems(Product, "product");

// @desc      get one product
// @route     DELETE  /api/v1/products/:id
// @access    public
exports.getOneProduct = handleFactory.getOneItem(Product, "product");

// @desc      delete one product
// @route     DELETE  /api/v1/products/:id
// @access    protected ==> admin
exports.deleteOneProduct = handleFactory.deleteOneItem(Product, "product");
