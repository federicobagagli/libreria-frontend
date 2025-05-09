import React, { useState, useEffect } from 'react';

const EditRecordModal = ({ record, onSave, onClose }) => {
  const [editedRecord, setEditedRecord] = useState({ ...record });

  const FIELD_LABELS = {
    cdNumber: 'Numero CD',
    drawer: 'Cassetto',
    composerAuthor: 'Compositore / Autore',
    albumTitle: 'Titolo Album',
    trackTitle: 'Titolo Brano',
    ensemble: 'Organico',
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
      <div className="modal-content" style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
        <h3>Modifica Disco</h3>
        <form onSubmit={handleSubmit}>
          {Object.entries(editedRecord).map(([key, value]) => (
            key !== 'id' && (
              <div key={key} style={{ marginBottom: 10 }}>
                <label>{FIELD_LABELS[key] || key}:</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
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

export default EditRecordModal;
