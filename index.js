const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const addressRoutes = require("./routes/addressRoutes");
const userRoutes = require("./routes/userRoutes");
const mongoose = require("mongoose");

require("dotenv").config();
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://shailesh:shailesh@cluster0.vk5zvbn.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: true,
    }
  )
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/address", addressRoutes);
app.use("/user", userRoutes);
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
const port = process.env.PORT || 8800;

app.listen(port, () => console.log(`Server is running at port ${port}.`));
