import React from "react";
import "../../styles/RentalsTable.css"; // CSS 파일을 import

const RentalsTable = ({ rentals }) => {
  return (
    <div>
      <h2>Rentals Table</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Book Title</th>
            <th>Price</th>
            <th>Rental Start</th>
            <th>Rental End</th>
            <th>Returned</th>
            <th>Return Location</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental) => (
            <tr key={rental.id}>
              <td>{rental.id}</td>
              <td>{rental.username}</td>
              <td>{rental.title}</td>
              <td>{rental.price.toLocaleString()}원</td>
              <td>{new Date(rental.rental_start).toLocaleDateString()}</td>
              <td>{new Date(rental.rental_end).toLocaleDateString()}</td>
              <td
                data-returned={
                  rental.returned === "홍대입구역 1번 출구" ? "yes" : "no"
                }
              >
                {rental.returned === "홍대입구역 1번 출구"
                  ? "Returned"
                  : "Not Returned"}
              </td>
              <td>{rental.return_location || "N/A"}</td>
              <td>{rental.address || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RentalsTable;
