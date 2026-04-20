import { useState } from 'react';
import './ContactPage.scss'
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    query: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (e.g., send data to backend)
    console.log(formData);
    // Clear form fields after submission
    setFormData({
      name: '',
      email: '',
      query: ''
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-content">
        <div className="social-links">
          <h2>Connect With Us:</h2>
          <br/>
          <i className='bi bi-facebook'></i>&nbsp;&nbsp;<a href="#">Facebook</a><br/>
          <i className='bi bi-twitter'></i>&nbsp;&nbsp;<a href="#">Twitter</a><br/>
          <i className='bi bi-instagram'></i>&nbsp;&nbsp;<a href="#">Instagram</a><br/>
          <i className='bi bi-envelope'></i>&nbsp;&nbsp;<a href="#">Email</a><br/>
        </div>
        <br/>
        <h3>Have a question or need assistance? Fill out the form below or connect with us on social media!</h3>
        <br/>
        <form className='form' onSubmit={handleSubmit}>
          <input type="text" placeholder='Name' id="name" name="name" value={formData.name} onChange={handleChange} required />
          <input type="email" placeholder='Email' id="email" name="email" value={formData.email} onChange={handleChange} required />
          <textarea id="query" placeholder='Query' name="query" value={formData.query} onChange={handleChange} required></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
