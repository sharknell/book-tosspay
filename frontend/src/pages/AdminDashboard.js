import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import AdminReturnSpots from "../components/admin/AdminReturnSpots";
import BooksTable from "../components/admin/BooksTable"; // BooksTable 컴포넌트 불러오기
import UsersTable from "../components/admin/UsersTable"; // UsersTable 컴포넌트 불러오기

const AdminDashboard = () => {
  const { accessToken, user, login, logout, loading } = useAuth(); // AuthContext에서 필요한 값들 불러옴
  const [books, setBooks] = useState([]);
  const [spots, setSpots] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // 반납 위치 불러오기
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

  // 책 데이터 가져오기
  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/admin/books",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // JWT 토큰을 Authorization 헤더에 포함
          },
        }
      );
      setBooks(response.data);
    } catch (error) {
      console.error("책 데이터를 가져오는 데 실패했습니다:", error);
      setError("책 데이터를 가져오는 데 실패했습니다.");
    }
  };

  // 사용자 데이터 가져오기
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // JWT 토큰을 Authorization 헤더에 포함
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("사용자 데이터를 가져오는 데 실패했습니다:", error);
      setError("사용자 데이터를 가져오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchBooks();
      fetchUsers();
    }
  }, [accessToken]); // accessToken이 바뀔 때마다 데이터 새로 불러옴

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!accessToken) {
    return <div>로그인 후 관리자 대시보드에 접근할 수 있습니다.</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>
      <AdminReturnSpots />
      <BooksTable books={books} /> {/* BooksTable 컴포넌트 추가 */}
      <UsersTable users={users} /> {/* UsersTable 컴포넌트 추가 */}
    </div>
  );
};

export default AdminDashboard;
