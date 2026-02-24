const userModel = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/hash");
const jwtUtil = require("../utils/jwt");
const sessionModel = require("../models/session.model");

/* REGISTER */
exports.register = async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).json({ message: "Invalid request body" });

    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password)
      return res.status(400).json({ message: "All fields required" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be 6+ chars" });

    const existing = await userModel.findByEmailOrMobile(email, mobile);
    if (existing)
      return res.status(409).json({ message: "Email or mobile already registered" });

    const passwordHash = await hashPassword(password);
    const userId = await userModel.createUser(name, email, mobile, passwordHash);

    res.status(201).json({ message: "User registered successfully", userId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* LOGIN */
exports.login = async (req, res) => {
  try {
    // accept both names from frontend
    const identifier = req.body.identifier || req.body.emailOrMobile;
    const { password } = req.body;

    if (!identifier || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await userModel.findByLogin(identifier);
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await comparePassword(password, user.password_hash);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwtUtil.generateAccessToken(user);
    const refreshToken = jwtUtil.generateRefreshToken(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await sessionModel.saveRefreshToken(user.id, refreshToken, expiresAt);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });

    const stored = await sessionModel.findToken(refreshToken);
    if (!stored)
      return res.status(403).json({ message: "Invalid session" });

    const payload = jwtUtil.verifyToken(refreshToken);

    const accessToken = jwtUtil.generateAccessToken({ id: payload.id });

    res.json({ accessToken });

  } catch (err) {
    return res.status(403).json({ message: "Token expired" });
  }
};
/* LOGOUT */
exports.logout = async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).json({ message: "Request body missing" });

    const refreshToken = req.body?.refreshToken;

    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required" });

    await sessionModel.deleteToken(refreshToken);

    res.json({ message: "Logged out successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Logout failed" });
  }
};