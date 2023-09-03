exports.mountRoutes = (app) => {
  const authRoute = require("./authRoute");
  const mealRoute = require("./mealRoute");
  const userRoute = require("./userRoute");
  const cartRoute = require("./cartRoute");
  const addressRoute = require("./addressRoute");
  const orderRoute = require("./orderRoute");
  const couponRoute = require("./couponRoute");
  const deliveryRoute = require("./deliveryRoute");
  const categoryRoute = require("./categoryRoute");
  const favoriteRoute = require("./favoriteRoute");
  const reviewRoute = require("./reviewRoute");

  app.use("/api/v1", authRoute);
  app.use("/api/v1", mealRoute);
  app.use("/api/v1", userRoute);
  app.use("/api/v1", cartRoute);
  app.use("/api/v1", addressRoute);
  app.use("/api/v1", orderRoute);
  app.use("/api/v1", couponRoute);
  app.use("/api/v1/delivery", deliveryRoute);
  app.use("/api/v1", categoryRoute);
  app.use("/api/v1", favoriteRoute);
  app.use("/api/v1/review", reviewRoute);
};
