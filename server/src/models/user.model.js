const db = require("../config/db");

exports.findByEmailOrMobile = async (email, mobile) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? OR mobile = ?",
    [email, mobile]
  );
  return rows[0];
};

exports.createUser = async (name, email, mobile, passwordHash) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, mobile, password_hash) VALUES (?, ?, ?, ?)",
    [name, email, mobile, passwordHash]
  );
  return result.insertId;
};

exports.findByLogin = async (identifier) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? OR mobile = ?",
    [identifier, identifier]
  );
  return rows[0];
};