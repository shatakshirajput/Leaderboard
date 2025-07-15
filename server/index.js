// server/index.js
const express  = require('express');
const http     = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const User         = require('./models/User');
const ClaimHistory = require('./models/ClaimHistory');

const app  = express();
const srv  = http.createServer(app);
const io   = new Server(srv, { cors:{ origin:'*' } });

const cors = require('cors');




app.use(express.json());

/* ───────────── ROUTES ───────────── */

app.get('/', (_req, res) =>
  res.send('🎉 Leaderboard API running'));

/* ▶️  Create user */

app.post('/api/users', async (req,res)=>{
  try{
    const { name } = req.body;
    if(!name) return res.status(400).json({ error:'name is required' });
    const user = await User.create({ name });
    io.emit('leaderboard-update');
    res.json(user);
  }catch(err){
    console.error(err);
    res.status(500).json({ error:'Could not create user' });
  }
});

/* ▶️  Claim random points */
app.post('/api/claim', async (req,res)=>{
  try{
    const { userId } = req.body;
    if(!userId) return res.status(400).json({ error:'userId is required' });

    const user = await User.findById(userId);
    if(!user)   return res.status(404).json({ error:'User not found' });

    const points = Math.floor(Math.random()*10)+1;
    user.totalPoints += points;
    await user.save();

    await ClaimHistory.create({ user:user._id, pointsClaimed:points });

    io.emit('leaderboard-update');
    res.json({
      message:'Points claimed successfully',
      userId:user._id,
      userName:user.name,
      pointsAwarded:points,
      newTotal:user.totalPoints
    });
  }catch(err){
    console.error(err);
    res.status(500).json({ error:'Something went wrong' });
  }
});

/* ▶️  Reset leaderboard & history */
app.post('/api/reset', async (_req,res)=>{
  try{
    await User.updateMany({}, { $set:{ totalPoints:0 } });
    await ClaimHistory.deleteMany({});
    io.emit('leaderboard-update');
    res.json({ message:'Leaderboard reset to zero for all users' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error:'Failed to reset leaderboard' });
  }
});

/* ▶️  Get leaderboard */
app.get('/api/leaderboard', async (_req,res)=>{
  try{
    const users = await User.find().sort({ totalPoints:-1 });
    res.json(users);
  }catch(err){
    res.status(500).json({ error:'Failed to fetch leaderboard' });
  }
});

/* ▶️  Get history (latest 100) */
app.get('/api/history', async (_req,res)=>{
  try{
    const history = await ClaimHistory.find()
      .populate('user','name')
      .sort({ claimedAt:-1 })
      .limit(100);
    res.json(history);
  }catch(err){
    res.status(500).json({ error:'Failed to fetch history' });
  }
});

/* ───────────── SOCKET.IO ───────────── */
io.on('connection', socket=>{
  console.log('🔌  Client connected:', socket.id);
  socket.on('disconnect',()=> console.log('❌  Client disconnected', socket.id));
});

/* ───────────── START ───────────── */
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser:true })
  .then(()=>{
    console.log('✅ Connected to MongoDB');
    srv.listen(PORT,()=>console.log(`🚀 Server + Socket.io on http://localhost:${PORT}`));
  })
  .catch(err=>console.error('MongoDB error:', err));
  