import React, { useState } from 'react';
import { addUser } from '../api';
import './AddUser.css'; // Make sure this CSS file exists

const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) return;
    await addUser(name);
    setName('');
    onUserAdded();
  };

  return (
    <div className="add-user-card">
      <input
        type="text"
        placeholder="Enter user name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="add-user-input"
      />
      <button onClick={handleAdd} className="add-user-btn">
      Add User
      </button>
    </div>
  );
};

export default AddUser;
