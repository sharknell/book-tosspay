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

// 반납 위치 조회
router.get("/spots", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM return_spots");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "반납 위치 불러오기 실패" });
  }
});

// 반납 위치 추가
router.post("/spots", authenticateToken, async (req, res) => {
  const { name, lat, lng } = req.body;
  if (!name || !lat || !lng) {
    return res.status(400).json({ message: "모든 필드를 채워주세요." });
  }

  try {
    const result = await db.query(
      "INSERT INTO return_spots (name, lat, lng) VALUES (?, ?, ?)",
      [name, lat, lng]
    );
    res.status(201).json({ message: "반납 위치가 추가되었습니다." });
  } catch (err) {
    console.error("반납 위치 추가 실패:", err);
    res.status(500).json({ message: "반납 위치 추가 실패" });
  }
});

// 반납 위치 수정
router.put("/spots/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, lat, lng } = req.body;

  if (!name || !lat || !lng) {
    return res.status(400).json({ message: "모든 필드를 채워주세요." });
  }

  try {
    const [result] = await db.query(
      "UPDATE return_spots SET name = ?, lat = ?, lng = ? WHERE id = ?",
      [name, lat, lng, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "반납 위치를 찾을 수 없습니다." });
    }

    res.json({ message: "반납 위치가 수정되었습니다." });
  } catch (err) {
    console.error("반납 위치 수정 실패:", err);
    res.status(500).json({ message: "반납 위치 수정 실패" });
  }
});

// 반납 위치 삭제
router.delete("/spots/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM return_spots WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "반납 위치를 찾을 수 없습니다." });
    }

    res.json({ message: "반납 위치가 삭제되었습니다." });
  } catch (err) {
    console.error("반납 위치 삭제 실패:", err);
    res.status(500).json({ message: "반납 위치 삭제 실패" });
  }
});
// 모든 대여 내역 가져오기
router.get("/rentals", authenticateToken, async (req, res) => {
  try {
    const [rentals] = await db.query(
      `SELECT rentals.id, users.username, rentals.book_id, rentals.title, rentals.price, rentals.rental_start, rentals.rental_end, rentals.returned, rentals.return_location, rentals.address 
      FROM rentals
      JOIN users ON rentals.user_id = users.id`
    );
    res.json(rentals);
  } catch (error) {
    console.error("대여 내역을 가져오는 데 오류가 발생했습니다:", error);
    res.status(500).json({ message: "대여 내역을 가져오는 데 실패했습니다." });
  }
});

// 특정 대여 내역 가져오기 (대여 ID로)
router.get("/rentals/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [rental] = await db.query(
      `SELECT rentals.id, users.username, rentals.book_id, rentals.title, rentals.price, rentals.rental_start, rentals.rental_end, rentals.returned, rentals.return_location, rentals.address 
      FROM rentals
      JOIN users ON rentals.user_id = users.id
      WHERE rentals.id = ?`,
      [id]
    );

    if (rental.length === 0) {
      return res.status(404).json({ message: "대여 내역을 찾을 수 없습니다." });
    }

    res.json(rental[0]);
  } catch (error) {
    console.error("대여 내역 조회 중 오류가 발생했습니다:", error);
    res.status(500).json({ message: "대여 내역 조회 중 오류가 발생했습니다." });
  }
});

// 대여 내역 수정 (반납 처리 등)
router.put("/rentals/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { returned, return_location, address } = req.body;

  if (returned === undefined || !return_location || !address) {
    return res
      .status(400)
      .json({ message: "필요한 정보를 모두 입력해주세요." });
  }

  try {
    const [result] = await db.query(
      `UPDATE rentals 
      SET returned = ?, return_location = ?, address = ? 
      WHERE id = ?`,
      [returned, return_location, address, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "대여 내역을 찾을 수 없습니다." });
    }

    res.json({ message: "대여 내역이 수정되었습니다." });
  } catch (error) {
    console.error("대여 내역 수정 중 오류가 발생했습니다:", error);
    res.status(500).json({ message: "대여 내역 수정 중 오류가 발생했습니다." });
  }
});

// 대여 내역 삭제
router.delete("/rentals/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM rentals WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "대여 내역을 찾을 수 없습니다." });
    }

    res.json({ message: "대여 내역이 삭제되었습니다." });
  } catch (error) {
    console.error("대여 내역 삭제 중 오류가 발생했습니다:", error);
    res.status(500).json({ message: "대여 내역 삭제 중 오류가 발생했습니다." });
  }
});

// 책 수정
router.put("/books/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    author,
    publisher,
    published_date,
    translators,
    price,
    sale_price,
  } = req.body;

  if (!title || !author || !publisher || !price) {
    return res.status(400).json({ message: "모든 필드를 채워주세요." });
  }

  try {
    const [result] = await db.query(
      "UPDATE books SET title = ?, author = ?, publisher = ?, published_date = ?, translators = ?, price = ?, sale_price = ? WHERE id = ?",
      [
        title,
        author,
        publisher,
        published_date,
        translators,
        price,
        sale_price,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "책을 찾을 수 없습니다." });
    }

    res.json({ message: "책이 수정되었습니다." });
  } catch (error) {
    console.error("책 수정 중 오류가 발생했습니다:", error);
    res.status(500).json({ message: "책 수정 중 오류가 발생했습니다." });
  }
});

module.exports = router;
