// from remote
require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

// const { initializeApp } = require("@firebase/app");
// const { firebaseConfig, storage } = require("./src/utils/firebase");

// from local
const path = require("path");
const ApiError = require("./src/utils/ApiError");
const { globalHandleError } = require("./src/middleware/errorMiddleware");
const {
  connectWithDatabase,
} = require("./src/middleware/databaseConnectionMiddleware");
const { mountRoutes } = require("./src/routes");

// to make uploads a static file
app.use("/src/uploads", express.static(path.join(__dirname, "src", "uploads")));

// to set other client to access data
app.use(cors());

// connecting with database
connectWithDatabase();

app.use(express.json({ limit: "50kb" }));

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}
console.log("i'm in " + process.env.NODE_ENV + " mode");

// mount route
app.get("/", (req, res, next) =>
  res.send(
    `welcome in my api use ${process.env.BASE_URL}api/v1/products to show meals`
  )
);

mountRoutes(app);

// firebase
// const run = async () => await firebase.initializeApp(firebaseConfig);
// run();

// handle all routes that not exist
app.all("*", (req, res, next) => {
  return next(new ApiError(`can't find this route ${req.originalUrl}`, 404));
});

// global error function
app.use(globalHandleError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, "0.0.0.0", (err) => {
  if (!err) {
    console.log("app listening on port " + PORT);
  }
});

process.on("unhandledRejection", (err) => {
  console.error(`rejection unhandled error ${err.name} -> ${err.message}`);
  // if have a pending request => server close after end it
  server.close(() => {
    console.log("shutting down application ...");
    // close app
    process.exit(1);
  });
});
