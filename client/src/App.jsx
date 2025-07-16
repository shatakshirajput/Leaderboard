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

const socket = io('http://localhost:4000');

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');

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

  const handleClaim = async () => {
    if (!selectedUser) return alert('Select a user first!');
    const res = await claimPoints(selectedUser);
    setMessage(`${res.data.userName} got ${res.data.pointsAwarded} points!`);
    await loadData();
    dismissMessage();
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all points?')) return;
    await resetLeaderboard();
    setMessage('Leaderboard has been reset!');
    await loadData();
    dismissMessage();
  };

  const dismissMessage = () => {
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => {
    loadData();
    socket.on('leaderboard-update', loadData);
    return () => {
      socket.off('leaderboard-update', loadData);
      socket.disconnect();
    };
  }, [loadData]);

  return (
    <main className="app-container">
      <h1 className="app-title">LeaderBoardX</h1>
      <h2 className='app-subtitle'>Track. Score. Lead.</h2>

      <div className="main-content-layout">
        {/* Left - Leaderboard */}
        <div className="left-panel">
          <div className="transparent-card">
            <Leaderboard users={users} />
          </div>
        </div>

        {/* Right - Controls + History */}
        <div className="right-panel">
          <section className="selector-section">
            <UserSelector
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />

            <div className="button-row">
              <button onClick={handleClaim} className="claim-btn">
                Claim
              </button>
              <button onClick={handleReset} className="reset-btn">
                Reset
              </button>
            </div>

            <div className="add-user-card transparent-card">
              <AddUser onUserAdded={loadData} />
            </div>
          </section>

          <div className="history-wrapper transparent-card">
            <History history={history} />
          </div>
        </div>
      </div>

      {message && <p className="message">{message}</p>}
    </main>
  );
}

export default App;
