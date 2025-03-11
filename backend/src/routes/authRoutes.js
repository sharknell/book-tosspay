const express = require("express");
const authService = require("../services/authService");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await authService.register(username, email, password);
    res.status(201).json({ message: "회원가입 성공" });
  } catch (error) {
    res.status(500).json({ message: "회원가입 실패" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const accessToken = await authService.login(email, password);
    res.json({ accessToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
