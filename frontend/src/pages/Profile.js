import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Profile.css";

const returnSpots = [
  { name: "홍대입구역 1번 출구", lat: 37.557192, lng: 126.924863 },
  { name: "서울시청 앞 광장", lat: 37.5662952, lng: 126.9779451 },
  { name: "잠실 롯데월드", lat: 37.511043, lng: 127.098167 },
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [selectedRental, setSelectedRental] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false); // 북마크 섹션을 열고 닫을 상태
  const [showRentalHistory, setShowRentalHistory] = useState(false); // 대여 내역 섹션을 열고 닫을 상태
  const mapRef = useRef(null);
  const { accessToken, refreshAccessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) return;
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5001/api/mypage/user",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setUser(data);
        fetchRentalHistory(data.id);
        fetchBookmarks(data.id);
        toast.success("사용자 정보 불러오기 성공");
      } catch (error) {
        if (error.response?.status === 403) {
          toast.warning("⏳ 토큰 갱신 중...");
          refreshAccessToken();
        } else {
          toast.error("사용자 정보 가져오기 실패");
        }
      }
    };
    fetchUserData();
  }, [accessToken, refreshAccessToken]);

  const fetchBookmarks = async (userId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5001/api/books/bookmarks/${userId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setBookmarks(data);
    } catch (err) {
      toast.error("북마크 불러오기 실패");
    }
  };

  const fetchRentalHistory = async (userId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5001/api/mypage/rentals/history/${userId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setRentalHistory(data);
    } catch (err) {
      toast.error("대여 내역 불러오기 실패");
    }
  };

  const handleShowBookmarks = () => {
    setShowBookmarks((prev) => !prev); // 북마크 섹션 토글
  };

  const handleShowRentalHistory = () => {
    setShowRentalHistory((prev) => !prev); // 대여 내역 섹션 토글
  };

  useEffect(() => {
    if (!showModal) return;
    const existingScript = document.querySelector(
      'script[src*="kakao.com/v2/maps/sdk.js"]'
    );
    setMapLoading(true);

    if (window.kakao && window.kakao.maps) {
      initMap();
    } else if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
      script.onload = () => {
        window.kakao.maps.load(initMap);
      };
      document.head.appendChild(script);
    }
  }, [showModal]);

  const initMap = () => {
    if (!mapRef.current) return;
    const { kakao } = window;

    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(returnSpots[0].lat, returnSpots[0].lng),
      level: 4,
    });

    returnSpots.forEach((spot) => {
      const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(spot.lat, spot.lng),
        title: spot.name,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        setSelectedSpot(spot);
        toast.info(`${spot.name} 선택됨`);
      });
    });
    setMapLoading(false);
  };

  const isReturnCompleted = (rental) =>
    returnSpots.some((spot) => spot.name === rental.returned);

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
        "http://localhost:5001/api/return",
        {
          order_id: selectedRental.order_id,
          return_location: selectedSpot.name,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      toast.success(`${selectedSpot.name} 반납 완료!`);
      setShowModal(false);
      setSelectedRental(null);
      setSelectedSpot(null);
      fetchRentalHistory(user.id);
    } catch (err) {
      toast.error("반납 처리 실패");
    }
  };

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

      {/* 북마크 섹션 */}
      <div className="bookmark-section">
        <h2 onClick={handleShowBookmarks} style={{ cursor: "pointer" }}>
          ⭐ 내가 북마크한 도서 {showBookmarks ? "▲" : "▼"}
        </h2>
        {showBookmarks && (
          <div>
            {bookmarks.length === 0 ? (
              <p>북마크한 도서가 없습니다.</p>
            ) : (
              <ul className="bookmark-list">
                {bookmarks.map((book) => (
                  <li key={book.id} className="bookmark-item">
                    <p>
                      <strong>도서명:</strong>{" "}
                      <a
                        href={`/books-list/${book.id}`}
                        className="bookmark-link"
                      >
                        {book.title}
                      </a>
                    </p>
                    <p>
                      <strong>저자:</strong> {book.author}
                    </p>
                    <p>
                      <strong>출판사:</strong> {book.publisher}
                    </p>
                    <p>
                      <img
                        src={book.cover_image || "/default-thumbnail.jpg"}
                        alt={book.title}
                        className="bookmark-image"
                      />
                    </p>
                    <p>
                      <strong>가격:</strong>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* 대여 내역 섹션 */}
      <div className="rental-history">
        <h2 onClick={handleShowRentalHistory} style={{ cursor: "pointer" }}>
          📚 대여 내역 {showRentalHistory ? "▲" : "▼"}
        </h2>
        {showRentalHistory && (
          <div>
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
                      {rental.rental_end || "미반납"}
                    </p>
                    <p>
                      <strong>가격:</strong> {rental.price.toLocaleString()}원
                    </p>
                    <button
                      onClick={() => handleReturnClick(rental)}
                      disabled={isReturnCompleted(rental)}
                    >
                      {isReturnCompleted(rental) ? "✅ 반납 완료" : "반납하기"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* 지도 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>📍 반납 위치 선택</h3>
            {mapLoading ? <p>지도를 불러오는 중...</p> : null}
            <div ref={mapRef} className="map-view" />
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
