import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const UserInfo = ({ user, setUser, setShowAddressModal, phone, setPhone }) => {
  const { accessToken } = useAuth();
  const [isPhoneEditing, setIsPhoneEditing] = useState(false);

  const handleSavePhone = async () => {
    try {
      await axios.patch(
        "http://localhost:5001/api/mypage/user/phone",
        { phone },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      toast.success("전화번호가 저장되었습니다!");
      const { data: updatedUser } = await axios.get(
        "http://localhost:5001/api/mypage/user",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setUser(updatedUser);
      setPhone("");
      setIsPhoneEditing(false);
    } catch (err) {
      toast.error("전화번호 저장 실패");
    }
  };

  return (
    <div className="user-info-container">
      {/* 이름 */}
      <div className="user-info-item">
        <label>이름</label>
        <input type="text" value={user.username} readOnly />
      </div>

      {/* 이메일 */}
      <div className="user-info-item">
        <label>이메일</label>
        <input type="email" value={user.email} readOnly />
      </div>
      {/* 이메일 */}
      <div className="user-info-item">
        <label>이름</label>
        <input type="text" value={user.name} readOnly />
      </div>

      {/* 전화번호 */}
      <div className="user-info-item">
        <label>전화번호</label>
        {isPhoneEditing ? (
          <div className="phone-edit">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="전화번호를 입력하세요"
            />
            <button onClick={handleSavePhone}>저장</button>
            <button onClick={() => setIsPhoneEditing(false)}>취소</button>
          </div>
        ) : user.phone ? (
          <div className="phone-info">
            <input type="text" value={user.phone} readOnly />
            <button onClick={() => setIsPhoneEditing(true)}>수정</button>
          </div>
        ) : (
          <div className="phone-edit">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="전화번호를 입력하세요"
            />
            <button onClick={handleSavePhone}>저장</button>
          </div>
        )}
      </div>

      {/* 주소 */}
      <div className="user-info-item">
        <label>주소</label>
        {user.address ? (
          <div className="address-info">
            <input type="text" value={user.address} readOnly />
            <button onClick={() => setShowAddressModal(true)}>변경</button>
          </div>
        ) : (
          <div className="address-info">
            <button onClick={() => setShowAddressModal(true)}>주소 추가</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
