import { Link } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <footer className="footer">
        <div>
          <h3>Contact Us</h3>
          <p>Email: support@plotzo.com</p>
          <p>Phone: +92 300 0000000</p>
          <p>Address: Lahore, Pakistan</p>
        </div>
        <div className="follow-footer">
          <h3>Follow Us</h3>
          <div>
            <i className="bi bi-facebook"></i>&nbsp;&nbsp;<a href="#">Facebook</a>
          </div>
          <div>
            <i className="bi bi-twitter"></i>&nbsp;&nbsp;<a href="#">Twitter</a>
          </div>
          <div>
            <i className="bi bi-instagram"></i>&nbsp;&nbsp;<a href="#">Instagram</a>
          </div>
          <div>
            <i className="bi bi-envelope"></i>&nbsp;&nbsp;<a href="#">Email</a>
          </div>
        </div>
        <div>
          <h3>Quick Links</h3>
          <p><Link to="/aboutus">About</Link></p>
          <p><Link to="/contact">Contact</Link></p>
          <p><Link to="/privacy">Privacy Policy</Link></p>
          <p><Link to="/terms">Terms & Conditions</Link></p>
          <p><Link to="/disclaimer">Disclaimer</Link></p>
        </div>
      </footer>
      <div className="copyright">
        <p>&copy; 2026 Plotzo. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
