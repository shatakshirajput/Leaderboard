import React from 'react';
import './Leaderboard.css';

const Leaderboard = ({ users }) => {
  const topThree = users.slice(0, 3);
  const others = users.slice(3);

  return (
    <div className="leaderboard-wrapper">
      <h2 className="leaderboard-title">👑 LeaderBoard</h2>

      <div className="podium">
        {topThree.map((user, index) => (
          <div key={user._id} className={`podium-card rank-${index + 1}`}>
            <div className="podium-rank">
              {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
            </div>
            <div className="podium-name">{user.name}</div>
            <div className="podium-score">{user.totalPoints} 🪙</div>
          </div>
        ))}
      </div>

      <div className="others">
        {others.map((user, i) => (
          <div className="other-user" key={user._id}>
            <span className="rank-num">{i + 4}</span>
            <span className="user-name">{user.name}</span>
            <span className="user-points">{user.totalPoints} 🪙</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
