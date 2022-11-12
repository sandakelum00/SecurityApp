const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
dotenv.config();

app.use(express.json());
// app.use(cors);

//import database connection
const connectBD = require("./Configuration/connect.js");

//import routes
const authRouter = require("./Routes/authRoutes.js");
const msgRouter = require("./Routes/messageRoutes.js");

//import middleware
const notFoundMiddleware = require("./Middlewares/not-found.js");
const errorHandlerMiddleware = require("./Middlewares/error-handler.js");
const authenticateUser = require("./Middlewares/auth.js");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/msg", authenticateUser, msgRouter);

app.get("/", (req, res) => {
  res.json("welcome");
});

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

//create database connection
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectBD(process.env.MONGO_URL);

    app.listen(port, () => {
      console.log(`Server Is Listening Port ${port}....`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
