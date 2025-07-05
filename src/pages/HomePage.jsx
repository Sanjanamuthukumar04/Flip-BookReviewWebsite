import React, { useEffect, useState } from 'react';
import { getTopBooks, searchBooks } from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [topBooks, setTopBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getTopBooks().then(setTopBooks);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const results = await searchBooks(searchQuery);
    if (results.length === 0) {
      setNoResults(true);
      setSearchResults([]);
    } else {
      setNoResults(false);
      setSearchResults(results);
    }
    setShowSearchResults(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
    setNoResults(false);
    setSearchResults([]);
  };

  const renderBookCard = (book) => {
    console.log('Book ID:', book.id);
    return (
      <div
        key={book.id}
        onClick={() => navigate(`/book/${book.id}`)}
        style={{
          cursor: 'pointer',
          border: '1px solid #ccc',
          padding: '10px',
          width: '150px',
          textAlign: 'center',
        }}
      >
        <img
          src={book.volumeInfo.imageLinks?.thumbnail}
          alt={book.volumeInfo.title}
          style={{ width: '100%' }}
        />
        <p>{book.volumeInfo.title}</p>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Flip!</h1>

      <div style={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search books..."
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
        {showSearchResults && (
          <button
            onClick={handleClearSearch}
            style={{ ...styles.button, marginLeft: '10px', backgroundColor: '#ccc', color: '#000' }}
          >
            Clear
          </button>
        )}
      </div>

      {!showSearchResults && (
        <>
          <h2 style={styles.sectionTitle}>Top Reviewed Books</h2>
          <div style={styles.booksGrid}>
            {topBooks.map(renderBookCard)}
          </div>
        </>
      )}

      {showSearchResults && (
        <>
          <h2 style={styles.sectionTitle}>Search Results</h2>
          {noResults ? (
            <p>No books found for “{searchQuery}”.</p>
          ) : (
            <div style={styles.booksGrid}>
              {searchResults.map(renderBookCard)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '20px',
  },
  searchContainer: {
    margin: '20px 0',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '1.2rem',
    width: '300px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  sectionTitle: {
    marginTop: '30px',
    fontSize: '2rem',
  },
  booksGrid: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
};
