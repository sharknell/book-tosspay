import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Profile.css"; // 스타일 파일 분리 권장

const Profile = () => {
  const { accessToken, refreshAccessToken } = useAuth();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (!accessToken) return;

      try {
        const response = await axios.get("http://localhost:5001/api/user", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(response.data);
        setUpdatedUsername(response.data.username);
        setUpdatedEmail(response.data.email);
      } catch (error) {
        console.error("❌ 사용자 정보 가져오기 실패:", error);
        if (error.response?.status === 403) {
          toast.warning("⏳ 토큰이 만료되어 갱신을 시도합니다.");
          refreshAccessToken();
        } else {
          toast.error("사용자 정보를 불러오는 데 실패했습니다.");
        }
      }
    };

    fetchUser();
  }, [accessToken, refreshAccessToken]);

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!updatedUsername || !updatedEmail) {
      toast.warn("⚠️ 모든 필드를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5001/api/user",
        { username: updatedUsername, email: updatedEmail },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setUser(response.data);
      setEditMode(false);
      toast.success("✅ 프로필이 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("❌ 프로필 업데이트 실패:", error);
      toast.error("프로필 업데이트에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (!user) {
    return <div className="loading">⏳ 사용자 정보를 불러오는 중...</div>;
  }

  return (
    <div className="profile-container">
      <ToastContainer position="top-center" autoClose={2000} />
      <h1 className="profile-title">내 프로필</h1>

      <div className="profile-info">
        {!editMode ? (
          <>
            <p>
              <strong>아이디:</strong> {user.username}
            </p>
            <p>
              <strong>이메일:</strong> {user.email}
            </p>
            <button className="edit-btn" onClick={handleEditToggle}>
              ✏️ 프로필 수정
            </button>
          </>
        ) : (
          <form className="profile-edit-form" onSubmit={handleProfileUpdate}>
            <div>
              <label htmlFor="username">아이디:</label>
              <input
                type="text"
                id="username"
                value={updatedUsername}
                onChange={(e) => setUpdatedUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email">이메일:</label>
              <input
                type="email"
                id="email"
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
              />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn-save">
                💾 저장
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleEditToggle}
              >
                ❌ 취소
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
