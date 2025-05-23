import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from '../axiosInstance'; // ✅ usa l'istanza configurata
import "./ConfigurationPage.css";
import TableDetailsModal from "./TableDetailsModal"; // lo creeremo dopo
console.log("DEBUG TableDetailsModal:", TableDetailsModal);

const ConfigurationPage = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/database/tables`)
      .then(response => {
        setTables(response.data);
      })
      .catch(error => {
        console.error("Errore nel recuperare le tabelle:", error);
      });
  }, []);

  return (
    <div>
      <h2>Configurazione Database</h2>
      <ul>
        {tables.map(table => (
            <li
            key={table}
            className="clickable-table"
            onClick={() => setSelectedTable(table)}
            >
            {table}
            </li>
        ))} 
        </ul>


      {selectedTable && (
        <TableDetailsModal
          tableName={selectedTable}
          onClose={() => setSelectedTable(null)}
        />
      )}

      <Link to="/user-management">
        <button>Add User</button>
      </Link>
    </div>
  );
};

export default ConfigurationPage;
