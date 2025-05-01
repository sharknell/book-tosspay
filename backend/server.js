require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./src/config/db"); // MySQL 연결 파일 불러오기
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // jwt 모듈 추가ㄴ
const bookRoutes = require("./src/routes/bookRoutes");
const rentalsRoutes = require("./src/routes/rentalsRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const mypageRoutes = require("./src/routes/mypageRoutes");
const returnRoutes = require("./src/routes/returnRoutes");
const { authenticateToken } = require("./src/middleware/authMiddleware");
const { initializeBooks } = require("./src/services/bookService");

const app = express();
app.use(cors());
app.use(express.json());
// 북마크 추가 및 제거 처리
app.use("/api/rentals", rentalsRoutes);
app.use("/api/books", bookRoutes);
// 회원가입 API
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 정보 저장
    const [result] = await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "회원가입 성공" });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json({ message: "회원가입 실패" });
  }
});
// 로그인 API
app.post("/api/login", async (req, res) => {
  console.log("로그인 요청:", req.body);
  const { email, password } = req.body;

  try {
    // 사용자 조회
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res
        .status(400)
        .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    const user = users[0];

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    // 액세스 토큰 생성
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    // 리프레시 토큰 생성
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    // 리프레시 토큰 DB에 저장
    await db.query(
      "INSERT INTO tokens (user_id, refresh_token) VALUES (?, ?)",
      [user.id, refreshToken]
    );

    // 토큰 반환
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({ message: "로그인 실패" });
  }
});
// 리프레시 토큰으로 액세스 토큰 재발급
app.post("/api/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "리프레시 토큰이 필요합니다." });
  }

  try {
    // 리프레시 토큰 검증
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 해당 리프레시 토큰이 DB에 존재하는지 확인
    const [rows] = await db.query(
      "SELECT * FROM tokens WHERE user_id = ? AND refresh_token = ?",
      [decoded.userId, refreshToken]
    );

    if (rows.length === 0) {
      return res
        .status(403)
        .json({ message: "리프레시 토큰이 유효하지 않습니다." });
    }

    // 액세스 토큰 생성
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
    console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
    console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    console.error("리프레시 토큰 오류:", error);
    res.status(403).json({ message: "리프레시 토큰이 유효하지 않습니다." });
  }
});

app.use("/api/mypage", mypageRoutes); // 마이페이지 라우트 추가

app.use("/toss-pay", paymentRoutes); // 결제 라우트 추가

// 메인 라우트 - 서버 정상 실행 확인
app.get("/", async (req, res) => {
  try {
    // 데이터베이스 연결 테스트
    const [rows] = await db.query("SELECT 1 + 1 AS solution");
    console.log("✅ 데이터베이스 테스트 결과:", rows[0].solution); // 2가 나와야 함
    res.send("✅ 서버 및 데이터베이스 연결 성공!");
  } catch (error) {
    console.error("❌ 데이터베이스 연결 실패:", error);
    res.status(500).send("❌ 데이터베이스 연결 실패!");
  }
});

app.use("/api/return", returnRoutes); // 반납 라우트 추가

initializeBooks(); // 서버 실행 시 도서 데이터 초기화

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중!`);
});
