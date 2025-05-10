// EditBookModal.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const EditBookModal = ({ book, onSave, onClose }) => {
  const [editedBook, setEditedBook] = useState({ ...book });

  useEffect(() => {
    setEditedBook({ ...book });
  }, [book]);

  const handleChange = (field, value) => {
    setEditedBook((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedBook);
  };

  if (!book) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
        <h3>Modifica Libro</h3>
        <form onSubmit={handleSubmit}>
          {Object.entries(editedBook).map(([key, value]) => (
            key !== 'id' && (
              <div key={key} style={{ marginBottom: 10 }}>
                <label>{key}:</label>
                {key === 'publishDate' ? (
                  <DatePicker
                    selected={value ? new Date(value) : null}
                    onChange={(date) => handleChange(key, date ? format(date, 'yyyy-MM-dd') : '')}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Seleziona una data"
                    className="custom-datepicker"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    yearDropdownItemNumber={150}
                    scrollableYearDropdown
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                )}
              </div>
            )
          ))}
          <button type="submit">Salva</button>
          <button type="button" onClick={onClose} style={{ marginLeft: 10 }}>Annulla</button>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;
