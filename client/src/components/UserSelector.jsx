import React from 'react';
import './UserSelector.css'; // 💡 Add custom styles here

const UserSelector = ({ users, selectedUser, setSelectedUser }) => (
  <div className="user-selector-container">
    <label htmlFor="user-select" className="user-label">Choose a user:</label>
    <select
      id="user-select"
      className="user-select"
      value={selectedUser}
      onChange={(e) => setSelectedUser(e.target.value)}
    >
      <option value="">-- Select User --</option>
      {users.map((user) => (
        <option key={user._id} value={user._id}>
          {user.name}
        </option>
      ))}
    </select>
  </div>
);

export default UserSelector;
