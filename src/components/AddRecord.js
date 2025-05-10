
import React, { useState, useRef } from 'react';
import axios from '../axiosInstance';
import './AddBook.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const AddRecord = () => {
  const [formData, setFormData] = useState({
    cdNumber: '',
    drawer: '',
    composerAuthor: '',
    albumTitle: '',
    trackTitle: '',
    ensemble: '',
    compositionDate: null,
    performers: '',
    genre: ''
  });

  const submitButtonRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const dataToSend = {
        ...formData,
        compositionDate: formData.compositionDate
          ? format(formData.compositionDate, 'yyyy-MM-dd')
          : '',
      };

      await axios.post('/records/create', dataToSend);
      setSuccessMessage('Disco aggiunto con successo!');
      setFormData({
        cdNumber: '',
        drawer: '',
        composerAuthor: '',
        albumTitle: '',
        trackTitle: '',
        ensemble: '',
        soloists: '',
        compositionDate: null,
        performers: '',
        genre: ''
      });
    } catch (error) {
      console.error('Errore durante l\'aggiunta del disco:', error);
      setErrorMessage('Errore durante l\'aggiunta del disco.');
    }
  };

  return (
    <div className="add-book-container">
      <h1>Inserisci un nuovo disco</h1>
      <form onSubmit={handleSubmit} className="add-book-form">
        <div><label>Numero CD</label><input type="text" value={formData.cdNumber} onChange={(e) => handleChange('cdNumber', e.target.value)} /></div>
        <div><label>Cassetto</label><input type="text" value={formData.drawer} onChange={(e) => handleChange('drawer', e.target.value)} /></div>
        <div><label>Compositore / Autore</label><input type="text" value={formData.composerAuthor} onChange={(e) => handleChange('composerAuthor', e.target.value)} required /></div>
        <div><label>Titolo Album</label><input type="text" value={formData.albumTitle} onChange={(e) => handleChange('albumTitle', e.target.value)}  /></div>
        <div><label>Titolo Brano</label><input type="text" value={formData.trackTitle} onChange={(e) => handleChange('trackTitle', e.target.value)}  /></div>
        <div><label>Organico</label><input type="text" value={formData.ensemble} onChange={(e) => handleChange('ensemble', e.target.value)}  /></div>
        <div><label>Solisti</label><input type="text" value={formData.soloists} onChange={(e) => handleChange('soloists', e.target.value)}/></div>
        <div className="datepicker-container">
          <label>Data Composizione</label>
          <DatePicker
            selected={formData.compositionDate}
            onChange={(date) => handleChange('compositionDate', date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Seleziona una data"
            className="custom-datepicker"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            yearDropdownItemNumber={900}
            scrollableYearDropdown
            minDate={new Date(1200, 0, 1)}
          />
        </div>
        <div><label>Interpreti</label><input type="text" value={formData.performers} onChange={(e) => handleChange('performers', e.target.value)}  /></div>
        <div><label>Genere</label><input type="text" value={formData.genre} onChange={(e) => handleChange('genre', e.target.value)}  /></div>
        <button type="submit" ref={submitButtonRef}>Salva</button>
      </form>
      {successMessage && <p className="success-msg">{successMessage}</p>}
      {errorMessage && <p className="error-msg">{errorMessage}</p>}
    </div>
  );
};

export default AddRecord;
