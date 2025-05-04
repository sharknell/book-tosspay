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
const adminRoutes = require("./src/routes/adminRoutes");
const authRoutes = require("./src/routes/authRoutes");

const { authenticateToken } = require("./src/middleware/authMiddleware");
const { initializeBooks } = require("./src/services/bookService");

const app = express();
app.use(cors());
app.use(express.json());
// 북마크 추가 및 제거 처리
app.use("/api", authRoutes);

app.use("/api/rentals", rentalsRoutes);
app.use("/api/books", bookRoutes);

app.use("/api/mypage", mypageRoutes); // 마이페이지 라우트 추가

app.use("/toss-pay", paymentRoutes); // 결제 라우트 추가
app.use("/api/admin", adminRoutes);
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
