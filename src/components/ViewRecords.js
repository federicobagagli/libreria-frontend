// ViewRecords.js generato automaticamente
import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import './ViewBooks.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jwtDecode } from 'jwt-decode';
import EditRecordModal from './EditRecordModal';

const FIELDS = ['cdNumber', 'drawer', 'composerAuthor', 'albumTitle', 'trackTitle', 'ensemble', 'compositionDate', 'performers', 'genre'];

function ViewRecords() {
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tabularView, setTabularView] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [columnFilters, setColumnFilters] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === 'ROLE_ADMIN');
    }
  }, []);

  const dynamicHeaders = records.length > 0 ? Object.keys(records[0]) : [];

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
    const worksheet = XLSX.utils.json_to_sheet(records);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Discoteca');
    if (worksheet['!ref']) worksheet['!autofilter'] = { ref: worksheet['!ref'] };
    worksheet['!cols'] = records.length > 0 ? Object.keys(records[0]).map(key => ({ wch: key.length + 10 })) : [];
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Discoteca.xlsx');
  };

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleColumnFilterChange = (key, value) => {
    setColumnFilters((prev) => ({ ...prev, [key]: value }));
  };

  const sortedRecords = React.useMemo(() => {
    let filtered = [...records];
    Object.entries(columnFilters).forEach(([key, val]) => {
      if (val) {
        filtered = filtered.filter(item => item[key] && item[key].toString().toLowerCase().includes(val.toLowerCase()));
      }
    });
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (typeof aValue === 'number' && typeof bValue === 'number') return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        const aStr = aValue?.toString() || '';
        const bStr = bValue?.toString() || '';
        return sortConfig.direction === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }
    return filtered;
  }, [records, sortConfig, columnFilters]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleVisualizza = async () => {
    try {
      const response = await axios.get('/records', { params: filters });
      setRecords(response.data);
    } catch (error) {
      console.error('Errore nella ricerca:', error);
      setRecords([]);
    } finally {
      setShowResults(true);
      setTabularView(false);
    }
  };

  const handleMostraTutti = async () => {
    try {
      const response = await axios.get('/records/all');
      setRecords(response.data);
    } catch (error) {
      console.error('Errore nel caricamento:', error);
      setRecords([]);
    } finally {
      setShowResults(true);
      setTabularView(false);
    }
  };

  const refetchRecords = async () => {
  try {
    const response = filters && Object.keys(filters).length > 0
      ? await axios.get('/records', { params: filters })
      : await axios.get('/records/all');
    setRecords(response.data);
  } catch (error) {
    console.error('Errore nel caricamento:', error);
    setRecords([]);
  }
};

  const handleEdit = (record) => {
    setEditingRecord({ ...record });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`/records/${editingRecord.id}`, editingRecord);
      setIsModalOpen(false);
      filters && Object.keys(filters).length ? handleVisualizza() : handleMostraTutti();
    } catch (error) {
      console.error('Errore nel salvataggio delle modifiche:', error);
    }
  };



  const handleDelete = async (id) => {
  if (window.confirm('Sei sicuro di voler eliminare questo disco?')) {
    try {
      await axios.delete(`/records/${id}`);
      await refetchRecords(); // ✅ aggiorna la lista ma NON cambia vista
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error);
    }
  }
};
  const toggleTabularView = () => setTabularView(!tabularView);

  return (
    <div className="view-books-container">
      <h2>Filtra per</h2>
      <div className="filters">
        {FIELDS.map((field) => (
          <div key={field} className="filter-row">
            <label>
              <input type="checkbox" checked={filters.hasOwnProperty(field)} onChange={() => handleFieldToggle(field)} />
              {field}
            </label>
            {filters.hasOwnProperty(field) && (
              <input type="text" placeholder={`Inserisci ${field}`} value={filters[field]} onChange={(e) => handleInputChange(field, e.target.value)} />
            )}
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button className="visualizza" onClick={handleVisualizza}>Visualizza</button>
        <button className="show-all" onClick={handleMostraTutti}>Mostra tutti</button>
        <button className="export-excel" onClick={exportToExcel} disabled={records.length === 0}>Esporta Excel</button>
        {showResults && records.length > 0 && (
          <button onClick={toggleTabularView}>{tabularView ? 'Vista Elenco' : 'Visualizza in Tabella'}</button>
        )}
      </div>
      {showResults && records.length === 0 && <p>Nessun record trovato.</p>}
      {showResults && records.length > 0 && tabularView && (
        <table className="books-table">
          <thead>
            <tr>
              <th>Azioni</th>
              {dynamicHeaders.map((header) => (
                <th key={header} onClick={() => handleSort(header)}>
                  {header}
                  {sortConfig.key === header && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                  <input type="text" placeholder="Filtra" value={columnFilters[header] || ''} onClick={(e) => e.stopPropagation()} onChange={(e) => handleColumnFilterChange(header, e.target.value)} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record, i) => (
              <tr key={i}>
                <td>
                    <button onClick={() => handleEdit(record)} style={{ fontSize: '14px', padding: '4px 6px', marginRight: '4px' }}>✏️</button>
                    <button onClick={() => handleDelete(record.id)}style={{ fontSize: '14px', padding: '4px 6px' }}>🗑️</button>
                </td>
                {dynamicHeaders.map((key) => (
                    <td key={key}>{record[key]}</td>
                ))}
               </tr>
            ))}
          </tbody>
        </table>
      )}
      {showResults && records.length > 0 && !tabularView && (
        <ul className="books-list">
          {records.map((record) => (
            <li key={record.id} className="book-item">
              <div className="book-info">
                {Object.entries(record).filter(([key]) => isAdmin || key !== 'user').map(([key, value]) => (
                  <div key={key}><strong>{key}:</strong> {value}</div>
                ))}
              </div>
              <div className="book-actions">
                <button className="edit-btn" onClick={() => handleEdit(record)}>Modifica</button>
                <button className="delete-btn" onClick={() => handleDelete(record.id)}>Elimina</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    
      {isModalOpen && editingRecord && (
        <EditRecordModal
          record={editingRecord}
          onSave={handleSaveChanges}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}



export default ViewRecords;
