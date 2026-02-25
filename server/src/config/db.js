const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

let sslConfig = undefined;

/* ---------- PRODUCTION DB SSL ---------- */
if (process.env.DB_SSL === "true") {
  try {
    // Read the CA certificate file (expected at server/certs/ca.pem)
    const caPath = path.join(__dirname, "../../certs/ca.pem");
    const ca = fs.readFileSync(caPath, "utf8");
    sslConfig = {
      ca: ca,
      rejectUnauthorized: true // Enforce certificate validation
    };
    console.log(" SSL enabled with CA certificate");
  } catch (err) {
    console.error(" Failed to load CA certificate, falling back to insecure SSL:", err.message);
    sslConfig = {
      rejectUnauthorized: false
    };
  }
}

/* ---------- CREATE POOL ---------- */
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: sslConfig
});

module.exports = db;
