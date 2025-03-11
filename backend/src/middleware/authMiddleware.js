const jwt = require("jsonwebtoken");
const db = require("../config/db");

// JWT 인증 미들웨어
exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "토큰이 필요합니다." });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        // 🔥 토큰이 만료된 경우 -> 리프레시 토큰으로 갱신 시도
        const refreshToken = req.headers["x-refresh-token"];
        if (!refreshToken) {
          return res
            .status(403)
            .json({ message: "토큰이 만료되었습니다. 다시 로그인하세요." });
        }

        try {
          const decodedRefresh = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
          );

          // 🔍 DB에서 리프레시 토큰이 유효한지 확인
          const [rows] = await db.query(
            "SELECT * FROM tokens WHERE user_id = ? AND refresh_token = ?",
            [decodedRefresh.userId, refreshToken]
          );

          if (rows.length === 0) {
            return res
              .status(403)
              .json({ message: "유효하지 않은 리프레시 토큰입니다." });
          }

          // ✅ 새로운 액세스 토큰 발급
          const newAccessToken = jwt.sign(
            { userId: decodedRefresh.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
          );

          res.setHeader("x-new-access-token", newAccessToken);
          req.user = { userId: decodedRefresh.userId };
          return next(); // 다음 미들웨어로 이동
        } catch (refreshError) {
          return res
            .status(403)
            .json({ message: "리프레시 토큰이 유효하지 않습니다." });
        }
      } else {
        return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
      }
    }

    req.user = decoded;
    next();
  });
};
