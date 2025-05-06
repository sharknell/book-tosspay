import React from "react";
import "../../styles/RentalsTable.css";

const RentalsTable = ({ rentals }) => {
  const today = new Date();

  return (
    <div className="rentals-table-wrapper">
      <h2 className="rentals-title">Rentals Table</h2>
      <table className="rentals-table">
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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental) => {
            const rentalEndDate = new Date(rental.rental_end);
            const isReturned = rental.returned === "홍대입구역 1번 출구";
            const isOverdue = !isReturned && rentalEndDate < today;

            return (
              <tr key={rental.id}>
                <td>{rental.id}</td>
                <td>{rental.username}</td>
                <td>{rental.title}</td>
                <td>{rental.price.toLocaleString()}원</td>
                <td>{new Date(rental.rental_start).toLocaleDateString()}</td>
                <td>{new Date(rental.rental_end).toLocaleDateString()}</td>
                <td
                  className={`returned-status ${
                    isReturned ? "returned" : "not-returned"
                  }`}
                >
                  {isReturned ? "Returned" : "Not Returned"}
                </td>
                <td>{rental.return_location || "N/A"}</td>
                <td>{rental.address || "N/A"}</td>
                <td
                  className={`rental-status ${
                    isOverdue
                      ? "overdue"
                      : isReturned
                      ? "complete"
                      : "in-progress"
                  }`}
                >
                  {isOverdue
                    ? "Overdue"
                    : isReturned
                    ? "Complete"
                    : "In Progress"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RentalsTable;
