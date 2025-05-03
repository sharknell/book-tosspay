const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 결제 성공 후 대여 정보 저장
router.post("/success", async (req, res) => {
  const {
    userId,
    email,
    bookId,
    title,
    price,
    from,
    to,
    orderId,
    address,
    phone,
  } = req.body;
  console.log("💬 요청 본문:", req.body);

  // 필수 필드 검증
  if (
    !userId ||
    !bookId ||
    !from ||
    !to ||
    !orderId ||
    !price ||
    !address ||
    !email
  ) {
    console.error("❌ 필수 정보 누락:", req.body);
    return res.status(400).json({ success: false, message: "필수 정보 누락" });
  }

  try {
    // 주문 중복 확인
    const [existingOrder] = await db.query(
      "SELECT * FROM rentals WHERE order_id = ?",
      [orderId]
    );

    if (existingOrder.length > 0) {
      return res.status(400).json({
        success: false,
        message: "이미 처리된 주문입니다.",
      });
    }

    // 대여 정보 저장
    await db.query(
      `INSERT INTO rentals 
        (user_id, email, book_id, title, price, rental_start, rental_end, address, phone, returned, order_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        email,
        bookId,
        title,
        price,
        from,
        to,
        address,
        phone,
        false,
        orderId,
      ]
    );

    console.log(
      `✅ 대여 저장 완료: userId=${userId}, bookId=${bookId}, 기간=${from}~${to}`
    );
    res.json({ success: true, message: "대여 정보 저장 완료" });
  } catch (error) {
    console.error("❌ 대여 저장 실패:", error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// 결제 실패 기록용
router.post("/fail", async (req, res) => {
  try {
    const { reason, orderId, userId } = req.body;

    // 주문 ID 중복 체크
    const existingFailure = await db.query(
      "SELECT * FROM payment_failures WHERE order_id = ?",
      [orderId]
    );

    if (existingFailure.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "이미 실패한 결제입니다." });
    }

    // 결제 실패 기록
    await db.query(
      "INSERT INTO payment_failures (user_id, order_id, reason) VALUES (?, ?, ?)",
      [userId || null, orderId || null, reason || "Unknown"]
    );

    res.status(200).json({ message: "❌ 결제 실패 기록 완료" });
  } catch (error) {
    console.error("❌ 결제 실패 기록 오류:", error);
    res.status(500).json({ message: "서버 오류로 실패 기록에 실패했습니다." });
  }
});

module.exports = router;
