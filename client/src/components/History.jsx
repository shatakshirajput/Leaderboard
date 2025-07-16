import './History.css';
import React, { useState } from 'react';

const History = ({ history }) => {
  const [showAll, setShowAll] = useState(false);

  const safeHistory = Array.isArray(history) ? history : [];
  const visibleHistory = showAll ? safeHistory : safeHistory.slice(0, 5);

  return (
    <div className="history-wrapper">
      <h3 className="history-title">📜 Claim Activity</h3>
      {safeHistory.length === 0 ? (
        <p className="history-empty">No claims yet.</p>
      ) : (
        <>
          <ul className="history-list">
            {visibleHistory.map((entry) => (
              <li key={entry._id} className="history-row">
                <span className="history-name">{entry.user.name}</span> claimed{' '}
                <span className="history-points">{entry.pointsClaimed}</span> pts on{' '}
                <span className="history-time">{new Date(entry.claimedAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          {safeHistory.length > 5 && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="toggle-btn"
            >
              {showAll ? 'Show Less ▲' : 'Read More ▼'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default History;
