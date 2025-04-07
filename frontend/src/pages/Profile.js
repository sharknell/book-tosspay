import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";

const Profile = () => {
  const { accessToken, refreshAccessToken } = useAuth();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const response = await axios.get("http://localhost:5001/api/user", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setUser(response.data);
          setUpdatedUsername(response.data.username);
          setUpdatedEmail(response.data.email);
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
          if (error.response && error.response.status === 403) {
            refreshAccessToken(); // 토큰 만료 시 갱신 시도
          }
        }
      }
    };

    fetchUser();
  }, [accessToken, refreshAccessToken]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!updatedUsername || !updatedEmail) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5001/api/user",
        {
          username: updatedUsername,
          email: updatedEmail,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setUser(response.data);
      setEditMode(false);
      alert("프로필이 업데이트되었습니다.");
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
    }
  };

  if (!user) {
    return <div className="loading">사용자 정보를 불러오는 중...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">내 프로필</h1>
      <div className="profile-info">
        <p>
          <strong>아이디:</strong> {user.username}
        </p>
        <p>
          <strong>이메일:</strong> {user.email}
        </p>

        {editMode ? (
          <form className="profile-form" onSubmit={handleProfileUpdate}>
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
            <button type="submit" className="save-btn">
              저장
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={handleEditToggle}
            >
              취소
            </button>
          </form>
        ) : (
          <button className="edit-btn" onClick={handleEditToggle}>
            프로필 수정
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
