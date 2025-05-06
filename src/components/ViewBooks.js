import React, { useState } from 'react';
import axios from '../axiosInstance'; // usa l'istanza configurata 
import './ViewBooks.css';  
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const FIELDS = ['titolo', 'autore', 'genere', 'anno'];

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [editingBook, setEditingBook] = useState(null);  
  const [isModalOpen, setIsModalOpen] = useState(false);  

  const handleFieldToggle = (field) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (updated[field] !== undefined) {
        delete updated[field];
      } else {
        updated[field] = '';
      }
      return updated;
    });
  };

  const exportToExcel = () => {
    console.log("books", books);  // ✅ log 1
    const worksheet = XLSX.utils.json_to_sheet(books);
    console.log("worksheet['!ref']", worksheet['!ref']);  // ✅ log 2
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Libreria");
  
    if (worksheet['!ref']) {
      worksheet['!autofilter'] = { ref: worksheet['!ref'] };
    }
  
    const maxColWidths = books.length > 0 ? Object.keys(books[0]).map(key => ({ wch: key.length + 10 })) : [];
    worksheet['!cols'] = maxColWidths;
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Libreria.xlsx');
  };
  
  

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: field === 'year' ? parseInt(value, 10) : value,
    }));
  };

  const handleVisualizza = async () => {
    const updatedFilters = {
      title: filters['titolo'] || '',  
      author: filters['autore'] || '',   
      genre: filters['genere'] || '',    
      year: filters['anno'] || '',       
    };

    try {
      const response = await axios.get(`/books`, { params: updatedFilters });
      setBooks(response.data);
    } catch (error) {
      console.error("Errore nella ricerca:", error);
      setBooks([]);
    } finally {
      setShowResults(true);
    }
  };

  const handleMostraTutti = async () => {
    try {
      const response = await axios.get(`/books/all`);
      setBooks(response.data);
    } catch (error) {
      console.error("Errore nel caricamento di tutti i libri:", error);
      setBooks([]);
    } finally {
      setShowResults(true);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Sei sicuro di voler eliminare questo libro?');
    if (confirmDelete) {
      try {
        await axios.delete(`/books/${id}`);
        filters && Object.keys(filters).length ? handleVisualizza() : handleMostraTutti();
      } catch (error) {
        console.error('Errore durante l\'eliminazione:', error);
      }
    }
  };

  const handleEdit = (book) => {
    console.log("Modifica libro:", book); 
    setEditingBook({ ...book });  // Assicura che i dati vengano copiati correttamente
    setIsModalOpen(true);   
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`/books/${editingBook.id}`, editingBook);
      setIsModalOpen(false);
      filters && Object.keys(filters).length ? handleVisualizza() : handleMostraTutti();
    } catch (error) {
      console.error('Errore nel salvataggio delle modifiche:', error);
    }
  };

  const handleInputChangeModal = (field, value) => {
    setEditingBook((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="view-books-container">
      <h2>Filtra per</h2>
      <div className="filters">
        {FIELDS.map((field) => (
          <div key={field} className="filter-row">
            <label>
              <input
                type="checkbox"
                checked={filters.hasOwnProperty(field)}
                onChange={() => handleFieldToggle(field)}
              />
              {field}
            </label>
            {filters.hasOwnProperty(field) && (
              <input
                type="text"
                placeholder={`Inserisci ${field}`}
                value={filters[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button className="visualizza" onClick={handleVisualizza}>Visualizza</button>
        <button className="show-all" onClick={handleMostraTutti}>Mostra tutti</button>
        <button
          className="export-excel"
          onClick={exportToExcel}
          disabled={books.length === 0}
        >
          Esporta Excel
        </button>
      </div>


      {showResults && books.length === 0 && <p>Nessun libro trovato.</p>}

      {showResults && books.length > 0 && (
        <ul className="books-list">
          {books.map((book) => (
            <li key={book.id} className="book-item">
              <div className="book-info">
                {Object.entries(book).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
              <div className="book-actions">
                <button className="edit-btn" onClick={() => handleEdit(book)}>
                  Modifica
                </button>
                <button className="delete-btn" onClick={() => handleDelete(book.id)}>
                  Elimina
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modale per la modifica */}
      {isModalOpen && editingBook && (
        <div className="edit-book-modal">
          <div className="modal-content">
            <h3>Modifica Libro</h3>
            <div className="modal-form">
            {[
              { label: 'Titolo', key: 'title' },
              { label: 'Autore', key: 'author' },
              { label: 'Genere', key: 'genre' },
              { label: 'Data Pubblicazione', key: 'publishDate' }
            ].map(({ label, key }) => (
              <div key={key}>
                <label>{label}</label>
                <input
                  type="text"
                  value={editingBook[key] || ''}
                  onChange={(e) => handleInputChangeModal(key, e.target.value)}
                />
              </div>
            ))}
            </div>
            <button className="close-btn" onClick={handleCloseModal}>Chiudi</button>
            <button className="save-btn" onClick={handleSaveChanges}>Salva Modifiche</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewBooks;
