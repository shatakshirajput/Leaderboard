import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL + '/api';

export const fetchUsers = () => axios.get(`${BASE_URL}/leaderboard`);
export const addUser = (name) => axios.post(`${BASE_URL}/users`, { name });
export const claimPoints = (userId) => axios.post(`${BASE_URL}/claim`, { userId });
export const fetchHistory = () => axios.get(`${BASE_URL}/history`);
export const resetLeaderboard = () => axios.post(`${BASE_URL}/reset`);
