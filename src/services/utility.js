exports.setUserIdInBody = (req, res, next) => {
  req.body.user = req.user._id;
  // use to set 
  if(req.params.mealId){
    req.body.meal = req.params.mealId
  }
  next();
};
