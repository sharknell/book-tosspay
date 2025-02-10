require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("서버가 정상적으로 실행 중입니다!");
  res.send("서버가 정상적으로 실행 중입니다!");
  res.send("서버가 정상적으로 실행 중입니다!");
  res.send("서버가 정상적으로 실행 중입니다!");
  res.send("서버가 정상적으로 실행 중입니다!");
  res.send("서버가 정상적으로 실행 중입니다!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중!🚀`);
});
