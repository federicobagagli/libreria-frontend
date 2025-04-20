import React from 'react';

function BookItem({ book }) {
  return (
    <div>
      <h2>{book.title}</h2>
      <p>Autore: {book.author}</p>
      <p>Data di pubblicazione: {book.publishDate}</p>
      <p>Genere: {book.genre}</p>
    </div>
  );
}

export default BookItem;
