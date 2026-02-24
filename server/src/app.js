const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const uploadRoutes = require("./routes/upload.routes");
const buyerRoutes = require("./routes/buyer.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const authMiddleware = require("./middleware/auth.middleware");
const db = require("./config/db");

const app = express();

/* -------------------- CORS FIX -------------------- */
const allowedOrigins = [
  "http://localhost:5173", // local react
  process.env.CLIENT_URL   // production frontend (Render)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow Postman or server-to-server requests (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

/* -------------------- BODY -------------------- */
app.use(express.json());

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

app.get("/", (req, res) => res.send("API Running"));

/* -------------------- DB CHECK -------------------- */
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