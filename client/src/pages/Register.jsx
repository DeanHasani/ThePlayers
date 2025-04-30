import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import VideoBackground from '../components/VideoBackground';
import '../styles/main.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Name validation: at least one letter, letters only
    if (!formData.name || !/^[A-Za-z]+$/.test(formData.name)) {
      newErrors.name = 'Name must contain only letters and at least one character';
    }

    // Surname validation: at least one letter, letters only
    if (!formData.surname || !/^[A-Za-z]+$/.test(formData.surname)) {
      newErrors.surname = 'Surname must contain only letters and at least one character';
    }

    // Phone validation: matches common formats (e.g., 123-456-7890, (123) 456-7890, +11234567890)
    if (!formData.phone || !/^\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number (e.g., 123-456-7890 or +11234567890)';
    }

    // Email validation: basic email format with @ and domain
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address (e.g., user@example.com)';
    }

    // Password validation: at least one letter and one number
    if (!formData.password || !/^(?=.*[A-Za-z])(?=.*\d).+$/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one letter and one number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for the field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if validation fails

    try {
      const res = await axios.post('http://localhost:3080/api/register', {
        email: formData.email,
        password: formData.password,
        name: formData.name, // Optional: send to backend
        surname: formData.surname, // Optional
        phone: formData.phone, // Optional
      });
      localStorage.setItem('token', res.data.token);
      navigate('/shop');
    } catch (err) {
      setErrors({ server: err.response?.data.msg || 'Registration failed' });
    }
  };

  return (
    <>
      <VideoBackground />
      <div className="auth-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          <div className="form-group">
            <input
              type="text"
              name="surname"
              placeholder="Surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />
            {errors.surname && <p className="error">{errors.surname}</p>}
          </div>
          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (e.g., 123-456-7890)"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button type="submit">Register</button>
        </form>
        {errors.server && <p className="error">{errors.server}</p>}
        <p>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </>
  );
};

export default Register;