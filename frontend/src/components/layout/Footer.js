import React from "react";
import { useAuth } from "../../context/authContext";
import "../../styles/Footer.css"; // CSS 파일 import

const Footer = () => {
  const { accessToken } = useAuth();
  const githubUrl = "https://github.com/sharknell"; // 여기에 본인의 GitHub 주소 입력

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <nav className="footer-nav">
          <ul>
            <li>
              <a
                href={githubUrl}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href={githubUrl}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href={githubUrl}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href={githubUrl}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </li>
            {accessToken && (
              <li>
                <a
                  href={githubUrl}
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My Profile
                </a>
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
