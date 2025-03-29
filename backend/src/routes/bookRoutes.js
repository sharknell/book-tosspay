const express = require("express");
const db = require("../config/db");

const router = express.Router();

// 📌 1️⃣ 도서 검색 API
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "검색어를 입력하세요." });

    const books = await searchBooks(query);
    res.json(books);
  } catch (error) {
    console.error("❌ 검색 API 오류:", error.message);
    res.status(500).json({ error: "검색 중 오류 발생" });
  }
});

// 📌 2️⃣ 도서 상세 정보 API
router.get("/books/:isbn", async (req, res) => {
  const { isbn } = req.params;
  const decodedIsbn = decodeURIComponent(isbn);

  try {
    const query = `SELECT * FROM books WHERE isbn = ? LIMIT 1`;
    const [rows] = await db.execute(query, [decodedIsbn]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "책 정보를 찾을 수 없습니다." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ 책 정보 가져오기 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

// 📌 3️⃣ 북마크 추가 API
router.post("/bookmarks", async (req, res) => {
  let { userId, isbn } = req.body;
  if (!userId || !isbn) {
    return res
      .status(400)
      .json({ error: "유효한 사용자 ID와 ISBN이 필요합니다." });
  }

  userId = Number(userId); // userId를 숫자로 변환
  if (isNaN(userId)) {
    return res.status(400).json({ error: "userId는 숫자여야 합니다." });
  }

  try {
    const query = "INSERT INTO bookmarks (user_id, isbn) VALUES (?, ?)";
    await db.execute(query, [userId, isbn]);
    res.status(201).json({ message: "북마크가 추가되었습니다." });
  } catch (error) {
    console.error("❌ 북마크 추가 오류:", error);
    res.status(500).json({ error: "북마크 추가 중 오류 발생" });
  }
});

// 📌 4️⃣ 북마크 삭제 API
router.delete("/bookmarks", async (req, res) => {
  let { userId, isbn } = req.body;
  if (!userId || !isbn) {
    return res
      .status(400)
      .json({ error: "유효한 사용자 ID와 ISBN이 필요합니다." });
  }

  userId = Number(userId);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "userId는 숫자여야 합니다." });
  }

  try {
    const query = "DELETE FROM bookmarks WHERE user_id = ? AND isbn = ?";
    await db.execute(query, [userId, isbn]);
    res.json({ message: "북마크가 삭제되었습니다." });
  } catch (error) {
    console.error("❌ 북마크 삭제 오류:", error);
    res.status(500).json({ error: "북마크 삭제 중 오류 발생" });
  }
});

// 📌 5️⃣ 북마크 상태 조회 API
router.get("/bookmarks/:userId/:isbn", async (req, res) => {
  let { userId, isbn } = req.params;
  userId = Number(userId);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "userId는 숫자여야 합니다." });
  }

  try {
    const query = "SELECT * FROM bookmarks WHERE user_id = ? AND isbn = ?";
    const [rows] = await db.execute(query, [userId, isbn]);
    res.json({ isBookmarked: rows.length > 0 });
  } catch (error) {
    console.error("❌ 북마크 상태 조회 오류:", error);
    res.status(500).json({ error: "북마크 상태 조회 중 오류 발생" });
  }
});

module.exports = router;
