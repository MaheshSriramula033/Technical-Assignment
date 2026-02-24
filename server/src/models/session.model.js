const db = require("../config/db");

exports.saveRefreshToken = async (userId, token, expiresAt) => {
  await db.query(
    "INSERT INTO sessions (user_id, refresh_token, expires_at) VALUES (?, ?, ?)",
    [userId, token, expiresAt]
  );
};

exports.findToken = async (token) => {
  const [rows] = await db.query(
    "SELECT * FROM sessions WHERE refresh_token = ?",
    [token]
  );
  return rows[0];
};

exports.deleteToken = async (token) => {
  await db.query("DELETE FROM sessions WHERE refresh_token = ?", [token]);
};