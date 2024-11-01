import express, { json } from "express";
import { connect } from "mongoose";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import Routes from "./Routes/Routes.js";
dotenv.config();

const corsOptions = {
  origin: "*", // Replace with your frontend URL
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use("/", Routes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});

connect(process.env.MONGODB_STRING)
  .then(() => {
    console.log("Mongo Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });