import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";

const authRoute = require("./routes/auth/authRoute");
const podcastRoute = require("./routes/podcast/podcastRoute");
const userRoute = require("./routes/users/userRoute");
const adminRoute = require("./routes/admin/adminRoute");

const app: Application = express();
const PORT = process.env.port || 8080;
import { verify } from "./middleware/tokenMiddleware";
const bodyParser = require("body-parser");
connectDB();

// middleware apply cors and all request
app.use(express.json());
app.use(cors());
app.set("trust proxy", 1);
app.use(bodyParser.json());
//routes

app.use("/api/auth", authRoute);
app.use("/api/podcast", verify, podcastRoute);
app.use("/api/users", verify, userRoute);
app.use("/api/admin", adminRoute);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

export default app;
