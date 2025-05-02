import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";

const AdminDashboard = () => {
  const { accessToken, user, login, logout, loading } = useAuth(); // AuthContext에서 필요한 값들 불러옴
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

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

      <h2>Books Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>{book.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Users Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
