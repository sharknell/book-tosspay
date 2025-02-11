require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./src/config/db"); // MySQL 연결 파일 불러오기
const fetch = require("node-fetch");

const bookRoutes = require("./src/routes/bookRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/books", bookRoutes);
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중!`);
});
