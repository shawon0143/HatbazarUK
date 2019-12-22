const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");
const categoryRoutes = require("./api/routes/categories");
const subCategoryRoutes = require("./api/routes/subCategories");
const brandRoutes = require("./api/routes/brands");
// Init app
const app = express();

mongoose.connect(
   "mongodb+srv://storm-chaser:" +
      process.env.MONGO_ATLAS_PW +
      "@hatbazaruk-shop-3dxmo.mongodb.net/test?retryWrites=true&w=majority",
   { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Public folder
app.use(express.static("./public"));

app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With. Content-Type, Accept, Authorization"
   );
   if (req.method === "OPTIONS") {
      res.header(
         "Access-Control-Allow-Methods",
         "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
   }
   next();
});

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/subCategories", subCategoryRoutes);
app.use("/brands", brandRoutes);

app.use((req, res, next) => {
   const error = new Error("Not found");
   error.status = 404;
   next(error);
});

app.use((error, req, res, next) => {
   res.status(error.status || 500);
   res.json({
      error: {
         message: error.message
      }
   });
});

module.exports = app;
