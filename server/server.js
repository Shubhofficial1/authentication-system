import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;
const MODE = process.env.MODE || "development";

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT} in ${MODE} mode`);
});
