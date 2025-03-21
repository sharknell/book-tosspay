import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "./Footer.css";

const Footer = () => {
  const { accessToken } = useAuth();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <nav className="footer-nav">
          <ul>
            <li>
              <Link to="/about" className="link">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="link">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/terms" className="link">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="link">
                Privacy Policy
              </Link>
            </li>
            {accessToken && (
              <li>
                <Link to="/profile" className="link">
                  My Profile
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="footer-info">
          <p>&copy; 2025 Book Rental, All Rights Reserved.</p>
          <p>Made In Sharknell</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// Compare this snippet from frontend/src/components/Footer.css:
