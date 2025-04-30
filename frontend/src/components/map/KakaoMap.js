// KakaoMap.jsx
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const returnSpots = [
  { name: "홍대입구역 1번 출구", lat: 37.557192, lng: 126.924863 },
  { name: "서울시청 앞 광장", lat: 37.5662952, lng: 126.9779451 },
  { name: "잠실 롯데월드", lat: 37.511043, lng: 127.098167 },
];

const KakaoMap = ({ onSelectSpot }) => {
  const mapRef = useRef(null);
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    const loadMap = () => {
      if (window.kakao && window.kakao.maps) {
        initMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
        script.onload = () => {
          window.kakao.maps.load(() => initMap());
        };
        document.head.appendChild(script);
      }
    };

    loadMap();
  }, []);

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
        onSelectSpot(spot); // Pass selected spot to parent component
        toast.info(`${spot.name} 위치 선택됨`);
      });
    });
  };

  return (
    <div>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "400px",
          marginBottom: "1rem",
          borderRadius: "8px",
        }}
      />
      {selectedSpot && (
        <p>
          선택한 위치: <strong>{selectedSpot.name}</strong>
        </p>
      )}
    </div>
  );
};

export default KakaoMap;
