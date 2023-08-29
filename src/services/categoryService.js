
const Category = require('../model/categoryModel');
const handleFactory = require('./handleFactory');


// @desc      create one Category
// @route     POST  /api/v1/Category
// @access    protected ==> admin
exports.createCategory = handleFactory.createItem(Category, 'Category')


// @desc      update one Category
// @route     PUT  /api/v1/Category/:id
// @access    protected ==> admin
exports.updateOneCategory = handleFactory.updateOneItem(Category, 'Category')


// @desc      get list of Category
// @route     GET  /api/v1/Category
// @access    public
exports.getListOfCategories = handleFactory.getListOfItems(Category, 'Category');


// @desc      get one Category
// @route     DELETE  /api/v1/Category/:id
// @access    public
exports.getOneCategory = handleFactory.getOneItem(Category, 'Category')


// @desc      delete one Category
// @route     DELETE  /api/v1/Category/:id
// @access    protected ==> admin
exports.deleteOneCategory = handleFactory.deleteOneItem(Category, 'Category')



