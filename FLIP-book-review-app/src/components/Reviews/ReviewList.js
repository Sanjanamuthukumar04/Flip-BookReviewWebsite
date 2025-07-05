import React from "react";

function ReviewList({ reviews, onToggleLike, onDelete }) {
  if (!reviews || reviews.length === 0) {
    return <p>No reviews yet. Be the first to leave one!</p>;
  }

  return (
    <div>
      {reviews.map((review, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>{review.user}</strong>: {review.text}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Rating: {review.rating} ⭐</span>
            <button
              onClick={() => onToggleLike(index)}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "20px",
                color: review.liked ? "red" : "gray",
              }}
            >
              ❤️
            </button>
            <span>{review.likes}</span>
            {review.user === 'You' && (
              <button
                onClick={onDelete}
                style={{
                  marginLeft: 'auto',
                  color: 'red',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent'
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
