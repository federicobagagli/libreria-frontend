import React, { useState } from 'react';
import { getBooks } from '../services/api';

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false); // 🔹 nuovo stato

  const handleLoadBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data);
    } catch (error) {
      console.error("Errore nel caricamento dei libri:", error);
      setBooks([]); // Se errore, mostra "nessun libro"
    } finally {
      setHasLoaded(true); // 🔹 lo impostiamo a true dopo il tentativo
    }
  };

  return (
    <div>
      <h2>Visualizza Libri</h2>
      <button onClick={handleLoadBooks}>Carica Libri</button>

      {hasLoaded && books.length === 0 && (
        <p>Nessun libro trovato.</p>
      )}

      {books.length > 0 && (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <strong>{book.titolo}</strong> - {book.autore}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewBooks;
