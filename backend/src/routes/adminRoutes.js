require("dotenv").config();
const express = require("express");
const db = require("../config/db"); // MySQL 연결 파일 불러오기
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// 모든 책 가져오기
router.get("/books", authenticateToken, async (req, res) => {
  try {
    const [books] = await db.query("SELECT * FROM books");
    res.json(books);
  } catch (error) {
    console.error("책 데이터를 가져오는 데 오류가 발생했습니다:", error);
    res.status(500).json({ message: "책 데이터를 가져오는 데 실패했습니다." });
  }
});

// 특정 책 가져오기 (책 ID로)
router.get("/books/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [book] = await db.query("SELECT * FROM books WHERE id = ?", [id]);
    if (book.length === 0) {
      return res.status(404).json({ message: "책을 찾을 수 없습니다." });
    }
    res.json(book[0]);
  } catch (error) {
    console.error("책 조회 중 오류가 발생했습니다:", error);
    res.status(500).json({ message: "책 조회 중 오류가 발생했습니다." });
  }
});

// 모든 사용자 가져오기
router.get("/users", authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, username, email, role FROM users"
    );
    res.json(users);
  } catch (error) {
    console.error("사용자 데이터를 가져오는 데 오류가 발생했습니다:", error);
    res
      .status(500)
      .json({ message: "사용자 데이터를 가져오는 데 실패했습니다." });
  }
});

// 특정 사용자 가져오기 (사용자 ID로)
router.get("/users/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db.query(
      "SELECT id, username, email, role FROM users WHERE id = ?",
      [id]
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    res.json(user[0]);
  } catch (error) {
    console.error("사용자 조회 중 오류가 발생했습니다:", error);
    res.status(500).json({ message: "사용자 조회 중 오류가 발생했습니다." });
  }
});

// 책 추가
router.post("/books", authenticateToken, async (req, res) => {
  const { title, author, category, price } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO books (title, author, category, price) VALUES (?, ?, ?, ?)",
      [title, author, category, price]
    );
    res.status(201).json({ message: "책이 추가되었습니다." });
  } catch (error) {
    console.error("책 추가 중 오류가 발생했습니다:", error);
    res.status(500).json({ message: "책 추가 중 오류가 발생했습니다." });
  }
});

// 책 수정
router.put("/books/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, author, category, price } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE books SET title = ?, author = ?, category = ?, price = ? WHERE id = ?",
      [title, author, category, price, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "책을 수정할 수 없습니다." });
    }
    res.json({ message: "책이 수정되었습니다." });
  } catch (error) {
    console.error("책 수정 중 오류가 발생했습니다:", error);
    res.status(500).json({ message: "책 수정 중 오류가 발생했습니다." });
  }
});

// 책 삭제
router.delete("/books/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM books WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "책을 삭제할 수 없습니다." });
    }
    res.json({ message: "책이 삭제되었습니다." });
  } catch (error) {
    console.error("책 삭제 중 오류가 발생했습니다:", error);
    res.status(500).json({ message: "책 삭제 중 오류가 발생했습니다." });
  }
});

// 사용자 역할 변경
router.put("/users/:id/role", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const [result] = await db.query("UPDATE users SET role = ? WHERE id = ?", [
      role,
      id,
    ]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "사용자 역할을 변경할 수 없습니다." });
    }
    res.json({ message: "사용자 역할이 변경되었습니다." });
  } catch (error) {
    console.error("사용자 역할 변경 중 오류가 발생했습니다:", error);
    res
      .status(500)
      .json({ message: "사용자 역할 변경 중 오류가 발생했습니다." });
  }
});

module.exports = router;
