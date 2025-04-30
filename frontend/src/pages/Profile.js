import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Profile.css";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const returnSpots = [
  { name: "홍대입구역 1번 출구", lat: 37.557192, lng: 126.924863 },
  { name: "서울시청 앞 광장", lat: 37.5662952, lng: 126.9779451 },
  { name: "잠실 롯데월드", lat: 37.511043, lng: 127.098167 },
];

const Profile = () => {
  const { accessToken, refreshAccessToken } = useAuth();
  const [user, setUser] = useState(null);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [selectedRental, setSelectedRental] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const mapRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      if (!accessToken) return;

      try {
        const response = await axios.get(
          "http://localhost:5001/api/mypage/user",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setUser(response.data);
        fetchRentalHistory(response.data.id);
      } catch (error) {
        if (error.response?.status === 403) {
          toast.warning("⏳ 토큰 갱신 중...");
          refreshAccessToken();
        } else {
          toast.error("사용자 정보 가져오기 실패");
        }
      }
    };

    const fetchRentalHistory = async (userId) => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/mypage/rentals/history/${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setRentalHistory(response.data);
      } catch (error) {
        toast.error("대여 내역 불러오기 실패");
      }
    };

    fetchUser();
  }, [accessToken, refreshAccessToken]);

  const handleReturnClick = (rental) => {
    setSelectedRental(rental);
    setShowModal(true);
  };

  const handleConfirmReturn = async () => {
    if (!selectedSpot || !selectedRental) {
      toast.warning("반납 위치를 선택해주세요.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5001/api/return`,
        {
          order_id: selectedRental.order_id,
          return_location: selectedSpot.name,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      toast.success(`📚 ${selectedSpot.name}에서 반납 완료!`);
      setShowModal(false);
      setSelectedRental(null);
      setSelectedSpot(null);
    } catch (error) {
      toast.error("반납 처리 실패");
    }
  };

  useEffect(() => {
    if (showModal && window.kakao && mapRef.current) {
      window.kakao.maps.load(() => {
        const center = new window.kakao.maps.LatLng(
          returnSpots[0].lat,
          returnSpots[0].lng
        );
        const map = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: 4,
        });

        returnSpots.forEach((spot) => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(spot.lat, spot.lng),
            map,
            title: spot.name,
          });

          window.kakao.maps.event.addListener(marker, "click", () => {
            setSelectedSpot(spot);
            toast.info(`${spot.name} 위치 선택됨`);
          });
        });
      });
    }
  }, [showModal]);

  if (!user)
    return <div className="loading">⏳ 사용자 정보를 불러오는 중...</div>;

  return (
    <div className="profile-container">
      <ToastContainer position="top-center" autoClose={2000} />
      <h1 className="profile-title">내 프로필</h1>

      <div className="profile-info">
        <p>
          <strong>아이디:</strong> {user.username}
        </p>
        <p>
          <strong>이메일:</strong> {user.email}
        </p>
      </div>

      <div className="rental-history">
        <h2>📚 대여 내역</h2>
        {rentalHistory.length === 0 ? (
          <p>대여한 도서가 없습니다.</p>
        ) : (
          <ul className="rental-list">
            {rentalHistory.map((rental) => (
              <li key={rental.order_id} className="rental-item">
                <p>
                  <strong>도서명:</strong> {rental.title}
                </p>
                <p>
                  <strong>ISBN:</strong> {rental.isbn}
                </p>
                <p>
                  <strong>대여 기간:</strong> {rental.rental_start} ~{" "}
                  {rental.rental_end}
                </p>
                <p>
                  <strong>가격:</strong> {rental.price.toLocaleString()}원
                </p>
                <button onClick={() => handleReturnClick(rental)}>
                  반납하기
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>📍 반납 위치 선택</h3>

            <Map
              center={returnSpots[0]} // 첫 장소 중심
              style={{
                width: "100%",
                height: "400px",
                marginBottom: "1rem",
                borderRadius: "8px",
              }}
              level={4}
            >
              {returnSpots.map((spot, index) => (
                <MapMarker
                  key={index}
                  position={{ lat: spot.lat, lng: spot.lng }}
                  onClick={() => {
                    setSelectedSpot(spot);
                    toast.info(`${spot.name} 위치 선택됨`);
                  }}
                >
                  <div style={{ padding: "5px", color: "#000" }}>
                    {spot.name}
                  </div>
                </MapMarker>
              ))}
            </Map>

            {selectedSpot && (
              <p>
                선택한 위치: <strong>{selectedSpot.name}</strong>
              </p>
            )}
            <div className="modal-buttons">
              <button onClick={handleConfirmReturn}>반납 확정</button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
