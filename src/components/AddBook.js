// src/components/AddBook.js
import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config/apiConfig';
import './AddBook.css';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publishDate: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await axios.post(`${API_URL}/books/create`, formData);
      setSuccessMessage('Libro aggiunto con successo!');
      setFormData({ title: '', author: '', genre: '', publishDate: '' });
    } catch (error) {
      console.error('Errore durante l\'aggiunta del libro:', error);
      setErrorMessage('Errore durante l\'aggiunta del libro.');
    }
  };

  return (
    <div className="add-book-container">
      <h1>Inserisci un nuovo libro</h1>
      <form onSubmit={handleSubmit} className="add-book-form">
        {['title', 'author', 'genre', 'publishDate'].map((field) => (
          <div key={field}>
            <label>{field}</label>
            <input
              type="text"
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit">Salva</button>
      </form>
      {successMessage && <p className="success-msg">{successMessage}</p>}
      {errorMessage && <p className="error-msg">{errorMessage}</p>}
    </div>
  );
};

export default AddBook;
