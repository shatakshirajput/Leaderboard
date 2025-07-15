import './History.css';
import React, { useState } from 'react';

const History = ({ history }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleHistory = showAll ? history : history.slice(0, 5);

  return (
    <div className="history-container">
      <h3>📜 Claim History</h3>
      {history.length === 0 ? (
        <p className="empty-message">No claims yet.</p>
      ) : (
        <>
          <ul className="history-list">
            {visibleHistory.map((entry) => (
              <li key={entry._id} className="history-item">
                <span className="user-name">{entry.user.name}</span> claimed{' '}
                <span className="points">{entry.pointsClaimed}</span> points on
                <span className="timestamp">
                  {' '}
                  {new Date(entry.claimedAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          {history.length > 5 && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="read-more-btn"
            >
              {showAll ? 'Show Less' : 'Read More'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default History;
