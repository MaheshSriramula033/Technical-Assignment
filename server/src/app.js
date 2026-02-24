const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth.routes");
const uploadRoutes = require("./routes/upload.routes");
const buyerRoutes = require("./routes/buyer.routes");
const dashboardRoutes = require("./routes/dashboard.routes");




const db = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/dashboard", dashboardRoutes);
const authMiddleware = require("./middleware/auth.middleware");

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

app.get("/", (req, res) => res.send("API Running"));

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("Aiven MySQL Connected");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
})();

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on ${process.env.PORT || 5000}`)
);