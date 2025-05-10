
import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import './ViewBooks.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jwtDecode } from 'jwt-decode';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const FIELDS = ['titolo', 'autore', 'genere', 'anno'];

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tabularView, setTabularView] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [columnFilters, setColumnFilters] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === "ROLE_ADMIN");
    }
  }, []);

  const dynamicHeaders = books.length > 0 ? Object.keys(books[0]) : [];

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
    const worksheet = XLSX.utils.json_to_sheet(books);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Libreria");
    if (worksheet['!ref']) worksheet['!autofilter'] = { ref: worksheet['!ref'] };
    worksheet['!cols'] = books.length > 0 ? Object.keys(books[0]).map(key => ({ wch: key.length + 10 })) : [];
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

  const handleColumnFilterChange = (key, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const sortedBooks = React.useMemo(() => {
    let filtered = [...books];
    Object.entries(columnFilters).forEach(([key, val]) => {
      if (val) {
        filtered = filtered.filter(book =>
          book[key] && book[key].toString().toLowerCase().includes(val.toLowerCase())
        );
      }
    });
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
      
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
      
        const aStr = aValue?.toString() || '';
        const bStr = bValue?.toString() || '';
        return sortConfig.direction === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
      
    }
    return filtered;
  }, [books, sortConfig, columnFilters]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleVisualizza = async () => {
    const queryParams = {
      title: filters['titolo'] || '',
      author: filters['autore'] || '',
      genre: filters['genere'] || '',
      year: filters['anno'] || ''
    };
    try {
      const response = await axios.get("/books", { params: queryParams });
      setBooks(response.data);
    } catch (error) {
      console.error("Errore nella ricerca:", error);
      setBooks([]);
    } finally {
      setShowResults(true);
      setTabularView(false);
    }
  };

  const handleMostraTutti = async () => {
    try {
      const response = await axios.get("/books/all");
      setBooks(response.data);
    } catch (error) {
      console.error("Errore nel caricamento di tutti i libri:", error);
      setBooks([]);
    } finally {
      setShowResults(true);
      setTabularView(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo libro?')) {
      try {
        await axios.delete(`/books/${id}`);
        filters && Object.keys(filters).length ? handleVisualizza() : handleMostraTutti();
      } catch (error) {
        console.error('Errore durante l eliminazione:', error);
      }
    }
  };

  const handleEdit = (book) => {
    setEditingBook({ ...book });
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
    setEditingBook((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTabularView = () => setTabularView(!tabularView);

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
        <button className="export-excel" onClick={exportToExcel} disabled={books.length === 0}>Esporta Excel</button>
        {showResults && books.length > 0 && (
          <button onClick={toggleTabularView}>
            {tabularView ? "Vista Elenco" : "Visualizza in Tabella"}
          </button>
        )}
      </div>

      {showResults && books.length === 0 && <p>Nessun libro trovato.</p>}

      {showResults && books.length > 0 && tabularView && (
        <table className="books-table">
          <thead>
            <tr>
              {dynamicHeaders.map((header) => (
                <th key={header} onClick={() => handleSort(header)}>
                  {header}
                  {sortConfig.key === header && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                  <input
                    type="text"
                    placeholder="Filtra"
                    value={columnFilters[header] || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleColumnFilterChange(header, e.target.value)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedBooks.map((book, i) => (
              <tr key={i}>
                {dynamicHeaders.map((key) => (
                  <td key={key}>{book[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showResults && books.length > 0 && !tabularView && (
        <ul className="books-list">
          {books.map((book) => (
            <li key={book.id} className="book-item">
              <div className="book-info">
                {Object.entries(book)
                  .filter(([key]) => isAdmin || key !== "user")
                  .map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
              </div>
              <div className="book-actions">
                <button className="edit-btn" onClick={() => handleEdit(book)}>Modifica</button>
                <button className="delete-btn" onClick={() => handleDelete(book.id)}>Elimina</button>
              </div>
            </li>
          ))}
        </ul>
      )}

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
            {key === 'publishDate' ? (
              <DatePicker
                selected={editingBook[key] ? new Date(editingBook[key]) : null}
                onChange={(date) =>
                  handleInputChangeModal(key, date ? format(date, 'yyyy-MM-dd') : '')
                }
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
                value={editingBook[key] || ''}
                onChange={(e) => handleInputChangeModal(key, e.target.value)}
              />
            )}
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
