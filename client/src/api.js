import axios from 'axios';

// ✅ Make sure this matches your backend server's actual port
const BASE_URL = 'https://leaderboard-qua5.onrender.com/api'; 

export const fetchUsers = () => axios.get(`${BASE_URL}/leaderboard`);
export const addUser = (name) => axios.post(`${BASE_URL}/users`, { name });
export const claimPoints = (userId) => axios.post(`${BASE_URL}/claim`, { userId });
export const fetchHistory = () => axios.get(`${BASE_URL}/history`);
export const resetLeaderboard = () => axios.post(`${BASE_URL}/reset`);
