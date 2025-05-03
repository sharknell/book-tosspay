const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ✅ 회원가입
router.post("/register", async (req, res) => {
  const { username, email, password, phoneNumber, fullAddress } = req.body;

  try {
    // 중복 확인
    const [existing] = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "이미 사용 중인 사용자명 또는 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, email, password, phone, address) VALUES (?, ?, ?, ?, ?)",
      [username, email, hashedPassword, phoneNumber, fullAddress]
    );

    res.status(201).json({ message: "회원가입 성공" });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json({ message: "회원가입 실패" });
  }
});

// ✅ 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res
        .status(400)
        .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30d" }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    await db.query(
      "INSERT INTO tokens (user_id, refresh_token) VALUES (?, ?)",
      [user.id, refreshToken]
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({ message: "로그인 실패" });
  }
});

// ✅ 토큰 재발급
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "리프레시 토큰이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const [rows] = await db.query(
      "SELECT * FROM tokens WHERE user_id = ? AND refresh_token = ?",
      [decoded.userId, refreshToken]
    );

    if (rows.length === 0) {
      return res
        .status(403)
        .json({ message: "리프레시 토큰이 유효하지 않습니다." });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  } catch (error) {
    console.error("리프레시 토큰 오류:", error);
    res.status(403).json({ message: "리프레시 토큰이 유효하지 않습니다." });
  }
});

module.exports = router;
