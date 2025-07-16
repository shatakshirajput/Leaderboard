import React from 'react';
import './UserSelector.css';

const UserSelector = ({ users, selectedUser, setSelectedUser }) => (
  <div className="selector-wrapper">
    <label htmlFor="user-select" className="selector-label">🎯 Select a Player</label>
    <select
      id="user-select"
      className="selector-dropdown"
      value={selectedUser}
      onChange={(e) => setSelectedUser(e.target.value)}
    >
      <option value="">-- Choose --</option>
      {Array.isArray(users) && users.map((user) => (
        <option key={user._id} value={user._id}>
          {user.name}
        </option>
      ))}
    </select>
  </div>
);

export default UserSelector;
