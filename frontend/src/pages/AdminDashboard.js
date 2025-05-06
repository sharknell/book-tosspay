import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import AdminReturnSpots from "../components/admin/AdminReturnSpots";
import BooksTable from "../components/admin/BooksTable";
import UsersTable from "../components/admin/UsersTable";
import RentalsTable from "../components/admin/RentalsTable";

const AdminDashboard = () => {
  const { accessToken, loading } = useAuth();
  const [books, setBooks] = useState([]);
  const [spots, setSpots] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // 유저 객체 전체 저장
  const [error, setError] = useState(null);

  const handleUserClick = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
    }
  };

  const filteredRentals = selectedUser
    ? rentals.filter((rental) => rental.username === selectedUser.username)
    : rentals;

  useEffect(() => {
    if (accessToken) {
      fetchBooks();
      fetchUsers();
      fetchRentals();
    }
  }, [accessToken]);

  useEffect(() => {
    if (selectedUser) {
      const filtered = rentals.filter(
        (rental) => String(rental.userId) === String(selectedUser.id)
      );
      console.log("선택된 유저 ID:", selectedUser.id);
      console.log("필터된 대여 내역:", filtered);
    }
  }, [selectedUser, rentals]);

  const fetchRentals = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/admin/rentals", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setRentals(res.data);
    } catch (error) {
      setError("대여 내역을 불러오는 데 실패했습니다.");
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/admin/books",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setBooks(response.data);
    } catch (error) {
      setError("책 데이터를 가져오는 데 실패했습니다.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      setError("사용자 데이터를 가져오는 데 실패했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!accessToken)
    return <div>로그인 후 관리자 대시보드에 접근할 수 있습니다.</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <hr />
      <AdminReturnSpots />
      <BooksTable books={books} setBooks={setBooks} />
      <UsersTable users={users} onUserClick={handleUserClick} />

      {selectedUser && (
        <div
          style={{
            marginTop: "2rem",
            border: "1px solid #ccc",
            padding: "1rem",
          }}
        >
          <h3>선택한 유저 정보</h3>
          <form>
            <div>
              <label>ID: </label>
              <input type="text" value={selectedUser.id} readOnly />
            </div>
            <div>
              <label>Username: </label>
              <input type="text" value={selectedUser.username} readOnly />
            </div>
            <div>
              <label>Email: </label>
              <input type="text" value={selectedUser.email} readOnly />
            </div>
            <div>
              <label>Role: </label>
              <input type="text" value={selectedUser.role} readOnly />
            </div>
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              style={{ marginTop: "1rem" }}
            >
              닫기
            </button>
          </form>

          <div style={{ marginTop: "2rem" }}>
            <h4>{selectedUser.username} 님의 대여 내역</h4>
            {filteredRentals.length > 0 ? (
              <RentalsTable rentals={filteredRentals} />
            ) : (
              <p>대여 내역이 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
