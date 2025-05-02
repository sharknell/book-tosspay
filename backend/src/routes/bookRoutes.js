const express = require("express");
const { searchBooks } = require("../services/bookService");
const db = require("../config/db");

const router = express.Router();

// 📌 1️⃣ 도서 검색 및 전체 조회 API
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    let books;
    if (query && query.trim() !== "") {
      // 검색어가 있을 경우: 검색
      books = await searchBooks(query);
    } else {
      // 검색어가 없을 경우: 전체 도서 목록
      const [rows] = await db.execute("SELECT * FROM books");
      books = rows;
    }

    res.json(books);
  } catch (error) {
    console.error("❌ 검색 API 오류:", error.message);
    res.status(500).json({ error: "검색 중 오류 발생" });
  }
});

// 📌 2️⃣ 도서 상세 정보 API
router.get("/books/:id", async (req, res) => {
  const { id } = req.params;

  console.log(`📌 요청된 도서 ID: ${id}`); // 요청된 ID 확인

  try {
    const query = `SELECT * FROM books WHERE id = ? LIMIT 1`;
    const [rows] = await db.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "책 정보를 찾을 수 없습니다." });
    }

    res.json(rows[0]); // 책 정보 반환
  } catch (error) {
    console.error("❌ 책 정보 가져오기 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

// 📌 3️⃣ 북마크 추가 API
router.post("/bookmarks", async (req, res) => {
  let { userId, id } = req.body;
  if (!userId || !id) {
    return res
      .status(400)
      .json({ error: "유효한 사용자 ID와 도서 ID 가 필요합니다." });
  }

  userId = Number(userId);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "userId는 숫자여야 합니다." });
  }

  try {
    const query = "INSERT INTO bookmarks (user_id, book_id) VALUES (?, ?)";
    await db.execute(query, [userId, id]);
    res.status(201).json({ message: "북마크가 추가되었습니다." });
  } catch (error) {
    console.error("❌ 북마크 추가 오류:", error);
    res.status(500).json({ error: "북마크 추가 중 오류 발생" });
  }
});

// 📌 4️⃣ 북마크 삭제 API
router.delete("/bookmarks", async (req, res) => {
  let { userId, id } = req.body;
  if (!userId || !id) {
    return res
      .status(400)
      .json({ error: "유효한 사용자 ID와 도서 ID가 필요합니다." });
  }

  userId = Number(userId);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "userId는 숫자여야 합니다." });
  }

  try {
    const query = "DELETE FROM bookmarks WHERE user_id = ? AND book_id = ?";
    await db.execute(query, [userId, id]);
    res.json({ message: "북마크가 삭제되었습니다." });
  } catch (error) {
    console.error("❌ 북마크 삭제 오류:", error);
    res.status(500).json({ error: "북마크 삭제 중 오류 발생" });
  }
});

// 📌 5️⃣ 북마크 상태 조회 API
router.get("/bookmarks/:userId/:id", async (req, res) => {
  let { userId, id } = req.params;
  userId = Number(userId);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "userId는 숫자여야 합니다." });
  }

  try {
    const query = "SELECT * FROM bookmarks WHERE user_id = ? AND book_id = ?";
    const [rows] = await db.execute(query, [userId, id]);
    res.json({ isBookmarked: rows.length > 0 });
  } catch (error) {
    console.error("❌ 북마크 상태 조회 오류:", error);
    res.status(500).json({ error: "북마크 상태 조회 중 오류 발생" });
  }
});

// 📌 6️⃣ 특정 사용자의 북마크 목록 조회 API
router.get("/bookmarks/:userId", async (req, res) => {
  const { userId } = req.params;
  if (isNaN(userId)) {
    return res.status(400).json({ error: "userId는 숫자여야 합니다." });
  }

  try {
    const query = `
      SELECT b.* 
      FROM bookmarks bm
      JOIN books b ON bm.book_id = b.id
      WHERE bm.user_id = ?
    `;
    const [rows] = await db.execute(query, [userId]);
    res.json(rows);
  } catch (error) {
    console.error("❌ 북마크 목록 조회 오류:", error);
    res.status(500).json({ error: "북마크 목록 조회 중 오류 발생" });
  }
});

module.exports = router;
