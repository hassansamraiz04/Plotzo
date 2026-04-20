import React from 'react';
import './Footer.scss'; // Import the SCSS file

const Footer = () => {
  return (
    <div className="footer-wrapper">
        <br/><br/>
<footer className="footer">
      <div>
        <h3>Contact Us</h3>
        <p>Email: info@example.com</p>
        <p>Phone: 123-456-7890</p>
        <p>Address: 123 Main Street, City, Country</p>
      </div>
      <div className='follow-footer'>
        <h3>Follow Us</h3>
        <div>
        <i className='bi bi-facebook'></i>&nbsp;&nbsp;<a href="#">Facebook</a><br/>
        </div>
        <div>
        <i className='bi bi-twitter'></i>&nbsp;&nbsp;<a href="#">Twitter</a><br/>
          
        </div>
        <div><i className='bi bi-instagram'></i>&nbsp;&nbsp;<a href="#">Instagram</a><br/>
          </div>
        <div><i className='bi bi-envelope'></i>&nbsp;&nbsp;<a href="#">Email</a><br/>
      </div>
          </div>
      <div>
        <h3>About Us</h3>
        <p>About the company and its mission.</p>
      </div>
    </footer>
    <div>
    <p>&copy; 2024 Plotzo: Real Estate Marketplace. All rights reserved.</p>
      
    </div>
    </div>
    
  );
};

export default Footer;
