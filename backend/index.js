const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/products");
const orderRoute = require("./routes/order");
const SubcategoryRoute = require("./routes/SubCategory");
const CategoryRoute = require("./routes/category");
const CartRoute = require("./routes/cart");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DBconnect"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/products", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/category/subcategory", SubcategoryRoute);
app.use("/api/cart", CartRoute);
app.listen(process.env.PORT || 5000, () => {
  console.log("BE server is running !");
});