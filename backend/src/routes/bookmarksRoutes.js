const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken } = require("../middleware/authMiddleware");

// 북마크 추가
router.post("/", authenticateToken, async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.userId; // JWT에서 userId 가져오기

  try {
    const [existing] = await db.query(
      "SELECT * FROM bookmarks WHERE user_id = ? AND book_id = ?",
      [userId, bookId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "이미 북마크된 책입니다." });
    }

    await db.query("INSERT INTO bookmarks (user_id, book_id) VALUES (?, ?)", [
      userId,
      bookId,
    ]);

    res.json({ success: true, message: "북마크에 추가되었습니다." });
  } catch (error) {
    console.error("북마크 추가 오류:", error);
    res.status(500).json({ error: "서버 오류 발생" });
  }
});

// 북마크 삭제
router.delete("/:bookId", authenticateToken, async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.userId; // JWT에서 userId 가져오기

  try {
    await db.query("DELETE FROM bookmarks WHERE user_id = ? AND book_id = ?", [
      userId,
      bookId,
    ]);

    res.json({ success: true, message: "북마크가 삭제되었습니다." });
  } catch (error) {
    console.error("북마크 삭제 오류:", error);
    res.status(500).json({ error: "서버 오류 발생" });
  }
});

// 사용자의 북마크 목록 조회
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.userId; // JWT에서 userId 가져오기

  try {
    const [bookmarks] = await db.query(
      "SELECT book_id FROM bookmarks WHERE user_id = ?",
      [userId]
    );

    res.json({ success: true, bookmarks: bookmarks.map((b) => b.book_id) });
  } catch (error) {
    console.error("북마크 조회 오류:", error);
    res.status(500).json({ error: "서버 오류 발생" });
  }
});

module.exports = router;
