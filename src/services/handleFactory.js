const expressAsyncHandler = require("express-async-handler");
const ApiFeature = require("../utils/ApiFeature");
const ApiError = require("../utils/ApiError");


exports.createItem = (Model, modelName) =>
   expressAsyncHandler(async (req, res, next) => {
      const response = await Model.create(req.body);
      res.status(200).json({
         data: response
      })
   })



exports.getListOfItems = (Model, modelName) =>
   expressAsyncHandler(async (req, res, next) => {
      let filter = {}
      if (req.body.filter) {
         filter = req.body.filter
      }

      const documentCounts = await Model.countDocuments()

      const apiFeature = new ApiFeature(Model.find(filter), req.query)
         .filter()
         .pagination(documentCounts)
         .search()
         .sort()
         .limitFields()

      const { mongooseQuery, paginationResults } = apiFeature

      const response = await mongooseQuery

      if (response.length < 1) {

         res.status(200).json({
            msg: 'no data match this filter'
         })

      }

      res.status(200).json({
         results: response.length,
         pagination: paginationResults,
         data: response
      })
   })



exports.getOneItem = (Model, modelName) =>
   expressAsyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const response = await Model.findById(id);
      if (!response) {
         return res.status(404).json({
            msg: `no ${modelName} matches this id=>${id}`
         })
      }
      return res.status(200).json({
         data: response
      })
   })



exports.deleteOneItem = (Model, modelName) =>
   expressAsyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const response = await Model.findByIdAndDelete(id);
      if (!response) {
         return next(new ApiError(`no ${modelName} matches this id => ${id}`, 404))
      }
      res.status(200).json({
         msg: `${modelName} Deleted successfully`,
      })
   })



exports.updateOneItem = (Model, modelName) =>
   expressAsyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const response = await Model.findByIdAndUpdate(id, req.body, { new: true });
      if (!response) {
         return next(new ApiError(`no ${modelName} matches this id => ${id}`, 404))
      }
      res.status(200).json({
         msg: `${modelName} Modified successfully`,
         data: response
      })
   })