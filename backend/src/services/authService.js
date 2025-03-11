const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.register = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword]
  );
};

exports.login = async (email, password) => {
  const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (users.length === 0) throw new Error("잘못된 이메일 또는 비밀번호");

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("잘못된 이메일 또는 비밀번호");

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  return accessToken;
};
