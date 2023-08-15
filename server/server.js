import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/api/signup", (req, res) => {
  res.json({
    data: "You Have hit signup endpoint",
  });
});

const PORT = process.env.PORT || 5000;
const MODE = process.env.MODE || "development";

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT} in ${MODE} mode}`);
});
