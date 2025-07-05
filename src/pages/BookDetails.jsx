import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Rating from '../components/UI/Rating';
import ReviewForm from '../components/Reviews/ReviewForm';
import ReviewList from '../components/Reviews/ReviewList';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Load book info and saved reviews from localStorage on mount or id change
  useEffect(() => {
    fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
      .then(res => res.json())
      .then(data => {
        setBook(data);

        // Try to load saved reviews from localStorage first
        const savedReviews = localStorage.getItem(`reviews_${id}`);
        if (savedReviews) {
          setReviews(JSON.parse(savedReviews));
        } else {
          // Fallback to your fakeReviews if no saved reviews found
          let fakeReviews = [];
          if (id === 'a86lCgAAQBAJ') {
            fakeReviews = [
              { user: 'manic_pinecone', text: 'The best book I have ever read and will probably ever read. Every line is poetry. Whenever I felt numb, I read this book to feel something, and feel I did. I think everyone should read this atleast once in their life.', rating: 5, likes: 7 },
              { user: 'Bob', text: 'Evocative writing.', rating: 4.0, likes: 5 },
            ];
          } else if (id === 'KS-cEAAAQBAJ') {
            fakeReviews = [
              { user: 'manic_pinecone', text: 'I read this book over a year ago. The fig-tree analogy continues to haunt me on random nights. Sylvia Plath is one of the most expressive writers of her generation. It is very sad that (SPOILER ALERT) while Esther Greenwood escaped the bell jar, Sylvia never did.', rating: 5.0, likes: 8 },
              { user: 'Dave', text: 'Too slow-paced for me', rating: 2.0, likes: 3 },
            ];
          } else if (id === 'ifn3EAAAQBAJ') {
            fakeReviews = [
              { user: 'manic_pinecone', text: 'This has to be Sally Rooney\'s best novel so far. Her writing style has evolved so beautifully and it is evident in the text. The switching POV is very well done. I especially enjoyed Peter\'s curt and cynical tone in contrast to Ivan\'s anxious and rambling manner of speech. A book on shared grief and how it affects two brother\'s lives and their relationships. A must read!', rating: 4.5, likes: 6 },
              { user: 'Frank', text: 'Deeply moving.', rating: 4.0, likes: 4 },
            ];
          }
          setReviews(fakeReviews);
        }
      });
  }, [id]);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem(`reviews_${id}`, JSON.stringify(reviews));
    }
  }, [reviews, id]);

  const handleAddReview = (newReview) => {
    if (reviews.some((r) => r.user === 'You')) {
      alert('You can only submit one review! Delete it to write again.');
      return;
    }
    setReviews([{ ...newReview, user: 'You', likes: 0 }, ...reviews]);
  };

  const handleLikeReview = (index) => {
    const updated = [...reviews];
    updated[index].liked = !updated[index].liked;
    updated[index].likes += updated[index].liked ? 1 : -1;
    setReviews(updated);
  };

  const handleDeleteReview = () => {
    setReviews(reviews.filter((r) => r.user !== 'You'));
  };

  if (!book) return <p>Loading book details...</p>;

  const info = book.volumeInfo;

  const randomRating = (Math.random() * 2 + 3).toFixed(1);
  const randomCount =
    Math.random() > 0.5
      ? `${Math.floor(Math.random() * 1000)}`
      : `${(Math.random() * 2 + 1).toFixed(1)}k`;

  return (
    <div style={{
      padding: '40px',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{info.title}</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>{info.authors?.join(', ')}</p>

      <div style={{
        display: 'flex',
        gap: '30px',
        marginBottom: '30px',
        alignItems: 'flex-start'
      }}>
        <div style={{
          flexShrink: 0,
          maxWidth: '220px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <img
            src={info.imageLinks?.thumbnail}
            alt={info.title}
            className="book-details-image"
          />
        </div>

        <div style={{ flex: 1, textAlign: 'left' }}>
          <Rating value={randomRating} count={randomCount} />
          <div
            style={{
              marginTop: '20px',
              lineHeight: '1.6',
              color: '#444',
            }}
            dangerouslySetInnerHTML={{
              __html: info.description || 'No description available.',
            }}
          />
        </div>
      </div>

      <h2 style={{ marginTop: '40px', color: '#333' }}>Leave a Review</h2>
      <div style={{ marginBottom: '40px' }}>
        <ReviewForm onSubmit={handleAddReview} />
      </div>

      <h2 style={{ marginBottom: '20px', color: '#333' }}>Reviews</h2>
      <ReviewList
        reviews={reviews}
        onToggleLike={handleLikeReview}
        onDelete={handleDeleteReview}
      />
    </div>
  );
}
