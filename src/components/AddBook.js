import React, { useState } from 'react';
import axios from '../axiosInstance';
import './AddBook.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publishDate: null,
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
      const dataToSend = {
        ...formData,
        publishDate: formData.publishDate
          ? format(formData.publishDate, 'yyyy-MM-dd')
          : '',
      };

      await axios.post(`/books/create`, dataToSend);
      setSuccessMessage('Libro aggiunto con successo!');
      setFormData({ title: '', author: '', genre: '', publishDate: null });
    } catch (error) {
      console.error('Errore durante l\'aggiunta del libro:', error);
      setErrorMessage('Errore durante l\'aggiunta del libro.');
    }
  };

  return (
    <div className="add-book-container">
      <h1>Inserisci un nuovo libro</h1>
      <form onSubmit={handleSubmit} className="add-book-form">
        <div>
          <label>Titolo</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>
        <div>
          <label>Autore</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => handleChange('author', e.target.value)}
            required
          />
        </div>
        <div>
          <label>Genere</label>
          <input
            type="text"
            value={formData.genre}
            onChange={(e) => handleChange('genre', e.target.value)}
            required
          />
        </div>
        <div className="datepicker-container">
          <label>Data di pubblicazione</label>
          <DatePicker
            selected={formData.publishDate}
            onChange={(date) => handleChange('publishDate', date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Seleziona una data"
            className="custom-datepicker"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            yearDropdownItemNumber={150}
            scrollableYearDropdown
            required
          />
        </div>
        <button type="submit">Salva</button>
      </form>
      {successMessage && <p className="success-msg">{successMessage}</p>}
      {errorMessage && <p className="error-msg">{errorMessage}</p>}
    </div>
  );
};

export default AddBook;
