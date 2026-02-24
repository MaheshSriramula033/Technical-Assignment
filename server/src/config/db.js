const mysql = require("mysql2/promise");
const fs = require("fs");

let sslConfig = undefined;

/* ---------- PRODUCTION DB SSL ---------- */
if (process.env.DB_SSL === "true") {
  sslConfig = {
    rejectUnauthorized: true
  };
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