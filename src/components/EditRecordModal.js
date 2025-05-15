import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const EditRecordModal = ({ record, onSave, onClose }) => {
  const [editedRecord, setEditedRecord] = useState({ ...record });

  const FIELD_LABELS = {
    cdNumber: 'Numero CD',
    drawer: 'Cassetto',
    composerAuthor: 'Compositore / Autore',
    albumTitle: 'Titolo Album',
    trackTitle: 'Titolo Brano',
    ensemble: 'Direttore/Orchestra',
    soloists: 'Solisti',
    compositionDate: 'Data Composizione',
    performers: 'Interpreti',
    genre: 'Genere',
    id: 'ID',
    user: 'Utente'
  };

  useEffect(() => {
    setEditedRecord({ ...record });
  }, [record]);

  const handleChange = (field, value) => {
    setEditedRecord((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedRecord);
  };

  if (!record) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw',
      height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        minWidth: 400,
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h3>Modifica Disco</h3>
        <form onSubmit={handleSubmit}>
          {Object.entries(editedRecord).map(([key, value]) => (
            key !== 'id' && (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 6 }}>
                  {FIELD_LABELS[key] || key}:
                </label>
                {key === 'compositionDate' ? (
                  <DatePicker
                    selected={value ? new Date(value) : null}
                    onChange={(date) =>
                      handleChange(key, date ? format(date, 'yyyy-MM-dd') : '')
                    }
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
                ) : key === 'user' ? (
                  <input
                    type="text"
                    value={value || ''}
                    disabled
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      fontSize: '14px',
                      backgroundColor: '#f0f0f0',
                      color: '#888'
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      fontSize: '14px'
                    }}
                  />
                )}
              </div>
            )
          ))}

          <div style={{ marginTop: 20 }}>
            <button type="submit" style={{ padding: '8px 16px' }}>Salva</button>
            <button type="button" onClick={onClose} style={{ marginLeft: 10, padding: '8px 16px' }}>Annulla</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecordModal;
