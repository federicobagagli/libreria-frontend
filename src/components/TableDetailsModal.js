import React, { useEffect, useState } from "react";
import axios from "axios";

const TableDetailsModal = ({ tableName, onClose }) => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ddl, setDdl] = useState(null);
  const [ddlLoading, setDdlLoading] = useState(false);
  const [ddlError, setDdlError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newColumn, setNewColumn] = useState({ name: "", type: "", nullable: true });
  const [addColumnError, setAddColumnError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const [addSuccess, setAddSuccess] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  useEffect(() => {
    loadColumns();
  }, [tableName]);

  const loadColumns = () => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/database/tables/${tableName}/columns`)
      .then(response => {
        setColumns(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Errore nel recuperare le colonne:", error);
        setError("Errore nel recuperare le colonne.");
        setLoading(false);
      });
  };

  const handleGenerateDDL = () => {
    setDdlLoading(true);
    setDdlError(null);
    axios.get(`${process.env.REACT_APP_API_URL}/database/tables/${tableName}/ddl`)
      .then(response => {
        setDdl(response.data);
        setDdlLoading(false);
      })
      .catch(error => {
        console.error("Errore nel recuperare la DDL:", error);
        setDdlError("Errore nel recuperare la DDL.");
        setDdlLoading(false);
      });
  };

  const handleAddColumn = () => {
    setAddColumnError(null);
    setAddSuccess(null);
    axios.post(`${process.env.REACT_APP_API_URL}/database/tables/${tableName}/addColumn`, newColumn)
      .then(() => {
        setShowAddForm(false);
        setNewColumn({ name: "", type: "", nullable: true });
        loadColumns();
        setAddSuccess(`Colonna "${newColumn.name}" aggiunta con successo.`);
        setTimeout(() => setAddSuccess(null), 3000);
      })
      .catch(error => {
        console.error("Errore nell'aggiunta della colonna:", error);
        setAddColumnError("Errore nell'aggiunta della colonna.");
      });
  };

  const handleDeleteColumn = (columnName) => {
    if (!window.confirm(`Sei sicuro di voler eliminare la colonna "${columnName}"?`)) {
      return;
    }
    setDeleteError(null);
    setDeleteSuccess(null);
    axios.delete(`${process.env.REACT_APP_API_URL}/database/tables/${tableName}/columns/${columnName}`)
      .then(() => {
        loadColumns();
        setDeleteSuccess(`Colonna "${columnName}" eliminata con successo.`);
        setTimeout(() => setDeleteSuccess(null), 3000);
      })
      .catch(error => {
        console.error("Errore nell'eliminazione della colonna:", error);
        setDeleteError(`Errore nell'eliminazione della colonna "${columnName}".`);
      });
  };

  return (
    <div style={modalStyle}>
      <h3>Dettagli tabella: {tableName}</h3>

      {loading && <p>Caricamento colonne...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
      {addColumnError && <p style={{ color: "red" }}>{addColumnError}</p>}
      {addSuccess && <p style={{ color: "green" }}>{addSuccess}</p>}
      {deleteSuccess && <p style={{ color: "green" }}>{deleteSuccess}</p>}

      {!loading && !error && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTdStyle}>Nome Colonna</th>
              <th style={thTdStyle}>Tipo</th>
              <th style={thTdStyle}>Nullable</th>
              <th style={thTdStyle}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col, index) => (
              <tr
                key={index}
                style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white" }}
              >
                <td style={thTdStyle}>
                    {col.COLUMN_NAME}
                    {(col.COLUMN_KEY === "PRI" || col.COLUMN_KEY === "MUL") && " 🔑"}
                </td>
                <td style={thTdStyle}>{col.DATA_TYPE}</td>
                <td style={thTdStyle}>{col.IS_NULLABLE}</td>
                <td style={thTdStyle}>
                <button
                    onClick={() => handleDeleteColumn(col.COLUMN_NAME)}
                    disabled={loading || col.COLUMN_KEY === "PRI" || col.COLUMN_KEY === "MUL"}
                    style={{ padding: "5px 10px" }}
                    title={
                    col.COLUMN_KEY === "PRI" || col.COLUMN_KEY === "MUL"
                        ? "Non puoi eliminare una colonna chiave"
                        : ""
                    }
                >
                    ❌ Elimina
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={handleGenerateDDL}
        style={buttonStyle}
        disabled={ddlLoading || loading}
      >
        {ddlLoading ? "Generando DDL..." : "Genera DDL"}
      </button>

      <button
        onClick={() => setShowAddForm(!showAddForm)}
        style={buttonStyle}
        disabled={loading}
      >
        {showAddForm ? "Annulla" : "Aggiungi Colonna"}
      </button>

      {showAddForm && (
        <div style={{ marginTop: "10px" }}>
          <h4>Nuova Colonna</h4>
          <input
            type="text"
            placeholder="Nome"
            value={newColumn.name}
            onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
            style={{ marginRight: "5px" }}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Tipo (es: VARCHAR(255))"
            value={newColumn.type}
            onChange={(e) => setNewColumn({ ...newColumn, type: e.target.value })}
            style={{ marginRight: "5px" }}
            disabled={loading}
          />
          <label>
            <input
              type="checkbox"
              checked={newColumn.nullable}
              onChange={(e) => setNewColumn({ ...newColumn, nullable: e.target.checked })}
              style={{ marginRight: "5px" }}
              disabled={loading}
            />
            Nullable
          </label>
          <button onClick={handleAddColumn} style={buttonStyle} disabled={loading}>
            Salva
          </button>
        </div>
      )}

      {ddlError && <p style={{ color: "red" }}>{ddlError}</p>}
      {ddl && (
        <div style={{ marginTop: "10px" }}>
          <h4>DDL:</h4>
          <pre style={ddlStyle}>{ddl}</pre>
        </div>
      )}

      <button onClick={onClose} style={buttonStyle}>Chiudi</button>
    </div>
  );
};

const modalStyle = {
  position: "fixed",
  top: "20%",
  left: "25%",
  width: "50%",
  padding: "20px",
  backgroundColor: "white",
  border: "1px solid #ccc",
  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  zIndex: 1000,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  border: "1px solid #ddd",
};

const thTdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

const buttonStyle = {
  marginTop: "10px",
  marginRight: "10px",
};

const ddlStyle = {
  backgroundColor: "#f5f5f5",
  padding: "10px",
  border: "1px solid #ccc",
  whiteSpace: "pre-wrap",
};

export default TableDetailsModal;
