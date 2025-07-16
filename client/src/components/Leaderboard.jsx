import React from 'react';
import './Leaderboard.css';

const Leaderboard = ({ users }) => {
  const safeUsers = Array.isArray(users) ? users : [];

  const topThree = safeUsers.slice(0, 3);
  const others = safeUsers.slice(3);

  return (
    <div className="leaderboard-wrapper">
      {/* Wings & Crown Style Title */}
      <div className="gold-header">
        <h2 className="leaderboard-title">🏆 Monthly Wealth Ranking</h2>
        <p className="leaderboard-subtitle">Settlement Time: 15 July 01:45 AM</p>
      </div>

      {/* Podium with Wing Crown Effect */}
      <div className="podium-golden">
        {topThree.map((user, index) => (
          <div key={user._id} className={`golden-card rank-${index + 1}`}>
            <div className="golden-rank-icon">
              {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
            </div>
            <div className="golden-name">{user.name}</div>
            <div className="golden-score">{user.totalPoints} 🪙</div>
          </div>
        ))}
      </div>

      {/* Remaining Users */}
      <div className="golden-others">
        {others.map((user, index) => (
          <div className="golden-other-row" key={user._id}>
            <span className="golden-rank">{index + 4}</span>
            <span className="golden-other-name">{user.name}</span>
            <span className="golden-other-score">{user.totalPoints} 🪙</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
