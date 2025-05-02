import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/AdminReturnSpots.css"; // CSS 파일 import

const AdminReturnSpots = () => {
  const { accessToken } = useAuth();
  const [spots, setSpots] = useState([]);
  const [form, setForm] = useState({ name: "", lat: "", lng: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // 🔍 검색 키워드
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const placesService = useRef(null); // 🔍 장소 검색 서비스

  const fetchSpots = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/admin/spots");
      setSpots(res.data);
    } catch (err) {
      setError("반납 위치 불러오기 실패");
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  // Kakao Map과 관련된 로직은 처음 한 번만 실행되도록 함
  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        initMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;
        script.onload = () => {
          window.kakao.maps.load(initMap);
        };
        document.head.appendChild(script);
      }
    };

    if (!mapInstance.current) {
      loadKakaoMap();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spots]);

  const initMap = () => {
    const { kakao } = window;
    const center = spots.length
      ? new kakao.maps.LatLng(spots[0].lat, spots[0].lng)
      : new kakao.maps.LatLng(37.5665, 126.978);

    const map = new kakao.maps.Map(mapRef.current, {
      center,
      level: 4,
    });

    mapInstance.current = map;
    placesService.current = new kakao.maps.services.Places(); // 🔍 서비스 객체 생성

    spots.forEach((spot) => {
      new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(spot.lat, spot.lng),
        title: spot.name,
      });
    });

    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      const latlng = mouseEvent.latLng;

      setForm((prev) => ({
        ...prev,
        lat: latlng.getLat(),
        lng: latlng.getLng(),
      }));

      toast.info("위치를 선택했습니다.");

      if (markerRef.current) {
        markerRef.current.setMap(null); // 기존 마커 제거
      }

      markerRef.current = new kakao.maps.Marker({
        map,
        position: latlng,
        title: "선택된 위치",
        zIndex: 10,
      });
    });
  };

  // 🔍 장소 검색 실행
  const handleSearch = () => {
    if (!searchKeyword.trim()) return;

    const { kakao } = window;
    placesService.current.keywordSearch(searchKeyword, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const first = result[0];
        const latlng = new kakao.maps.LatLng(first.y, first.x);

        mapInstance.current.setCenter(latlng);

        setForm((prev) => ({
          ...prev,
          lat: first.y,
          lng: first.x,
        }));

        if (markerRef.current) {
          markerRef.current.setMap(null); // 기존 마커 제거
        }

        markerRef.current = new kakao.maps.Marker({
          map: mapInstance.current,
          position: latlng,
          title: "검색된 위치",
          zIndex: 10,
        });

        toast.success("위치 검색 완료!");
      } else {
        toast.error("검색 결과가 없습니다.");
      }
    });
  };

  const handleEdit = (spot) => {
    setForm({ name: spot.name, lat: spot.lat, lng: spot.lng });
    setEditingId(spot.id);

    const { kakao } = window;
    const latlng = new kakao.maps.LatLng(spot.lat, spot.lng);

    if (mapInstance.current) {
      mapInstance.current.setCenter(latlng);
    }

    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Ensure kakao.maps.Animation is defined before using it
    if (kakao.maps.Animation) {
      markerRef.current = new kakao.maps.Marker({
        map: mapInstance.current,
        position: latlng,
        title: "수정 중인 위치",
        zIndex: 10,
        animation: kakao.maps.Animation.BOUNCE, // Only use if animation exists
      });
    } else {
      markerRef.current = new kakao.maps.Marker({
        map: mapInstance.current,
        position: latlng,
        title: "수정 중인 위치",
        zIndex: 10,
      });
    }

    toast.info("수정 위치가 지도에 표시되었습니다.");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/spots/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchSpots();
      toast.success("삭제 성공");
    } catch (err) {
      setError("삭제 실패");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:5001/api/admin/spots/${editingId}`
      : "http://localhost:5001/api/admin/spots";
    const method = editingId ? "put" : "post";

    try {
      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setForm({ name: "", lat: "", lng: "" });
      setEditingId(null);
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      fetchSpots();
      toast.success("저장 성공");
    } catch (err) {
      setError("저장 실패");
    }
  };

  return (
    <div className="admin-return-spots">
      <ToastContainer position="top-center" autoClose={1500} />
      <h2 className="heading">🗺️ 반납 위치 관리</h2>
      {error && <p className="error-message">{error}</p>}

      {/* 🔍 키워드 검색 UI */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="위치 검색 (예: 강남역)"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          검색
        </button>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <input
          className="form-input"
          placeholder="이름"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="form-input"
          placeholder="위도 (lat)"
          value={form.lat}
          onChange={(e) => setForm({ ...form, lat: e.target.value })}
          required
        />
        <input
          className="form-input"
          placeholder="경도 (lng)"
          value={form.lng}
          onChange={(e) => setForm({ ...form, lng: e.target.value })}
          required
        />
        <button className="submit-button" type="submit">
          {editingId ? "수정" : "추가"}
        </button>
      </form>

      <div ref={mapRef} className="map" />

      <ul className="spot-list">
        {spots.map((spot) => (
          <li className="spot-item" key={spot.id}>
            <strong>{spot.name}</strong> (Lat: {spot.lat}, Lng: {spot.lng})
            <button className="edit-button" onClick={() => handleEdit(spot)}>
              수정
            </button>
            <button
              className="delete-button"
              onClick={() => handleDelete(spot.id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReturnSpots;
