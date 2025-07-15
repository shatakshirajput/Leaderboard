import React, { useEffect, useState, useCallback } from 'react';
import {
  fetchUsers,
  claimPoints,
  fetchHistory,
  resetLeaderboard,
} from './api';

import { io } from 'socket.io-client';

import UserSelector from './components/UserSelector';
import AddUser from './components/AddUser';
import Leaderboard from './components/Leaderboard';
import History from './components/History';

import './App.css';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000');

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');

  // Load users and history
  const loadUsers = useCallback(async () => {
    const res = await fetchUsers();
    setUsers(res.data);
  }, []);

  const loadHistory = useCallback(async () => {
    const res = await fetchHistory();
    setHistory(res.data);
  }, []);

  const loadData = useCallback(async () => {
    await Promise.all([loadUsers(), loadHistory()]);
  }, [loadUsers, loadHistory]);

  // Claim Points
  const handleClaim = async () => {
    if (!selectedUser) return alert('Select a user first!');
    const res = await claimPoints(selectedUser);
    setMessage(`${res.data.userName} got ${res.data.pointsAwarded} points!`);
    await loadData();
    dismissMessage();
  };

  // Reset Leaderboard
  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all points?')) return;
    await resetLeaderboard();
    setMessage('Leaderboard has been reset!');
    await loadData();
    dismissMessage();
  };

  // Dismiss messages after 3s
  const dismissMessage = () => {
    setTimeout(() => setMessage(''), 3000);
  };

  // First mount + Socket event listener
  useEffect(() => {
    loadData();
    socket.on('leaderboard-update', loadData);
    return () => {
      socket.off('leaderboard-update', loadData);
      socket.disconnect();
    };
  }, [loadData]);

  // UI
  return (
    <main className="app-container">
      <h1 className="app-title">Claim Master</h1>

      <section className="selector-section">
        <UserSelector
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />

        {/* Button Row */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '1rem',
          }}
        >
          <button
            onClick={handleClaim}
            style={buttonStyle('#4f46e5', '#4338ca')}
          >
            Claim
          </button>
          <button
            onClick={handleReset}
            style={buttonStyle('#ef4444', '#dc2626')}
          >
            Reset
          </button>
        </div>

        {/* Add User Card */}
        <div
          style={{
            marginTop: '2rem',
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <AddUser onUserAdded={loadData} />
        </div>
      </section>

      {message && <p className="message">{message}</p>}

      <Leaderboard users={users} />
      <History history={history} />
    </main>
  );
}

const buttonStyle = (bg, hoverBg) => ({
  backgroundColor: bg,
  color: 'white',
  fontWeight: '600',
  padding: '0.6rem 1.4rem',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  transition: 'background-color 0.2s',
  outline: 'none',
  ':hover': { backgroundColor: hoverBg },
});

export default App;
