const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const ClaimHistory = require('./models/ClaimHistory');

const app = express();
const srv = http.createServer(app);

// ✅ Allowed frontend origins (add more if needed)
const allowedOrigins = [
  'http://localhost:5173',
  'https://leaderboard-beryl-pi.vercel.app'
];

// ✅ Socket.io CORS setup
const io = new Server(srv, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ Express CORS setup
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like Postman or curl
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.get('/', (_req, res) => res.send('Leaderboard API running'));

// ✅ Create user
app.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const user = await User.create({ name });
    io.emit('leaderboard-update');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create user' });
  }
});

// ✅ Claim points
app.post('/api/claim', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const points = Math.floor(Math.random() * 10) + 1;
    user.totalPoints += points;
    await user.save();

    await ClaimHistory.create({ user: user._id, pointsClaimed: points });

    io.emit('leaderboard-update');
    res.json({
      message: 'Points claimed successfully',
      userId: user._id,
      userName: user.name,
      pointsAwarded: points,
      newTotal: user.totalPoints
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ Reset leaderboard
app.post('/api/reset', async (_req, res) => {
  try {
    await User.updateMany({}, { $set: { totalPoints: 0 } });
    await ClaimHistory.deleteMany({});
    io.emit('leaderboard-update');
    res.json({ message: 'Leaderboard reset to zero for all users' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reset leaderboard' });
  }
});

// ✅ Get leaderboard
app.get('/api/leaderboard', async (_req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// ✅ Get history
app.get('/api/history', async (_req, res) => {
  try {
    const history = await ClaimHistory.find()
      .populate('user', 'name')
      .sort({ claimedAt: -1 })
      .limit(100);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ✅ Socket.io connection event
io.on('connection', socket => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected', socket.id));
});

// ✅ Start the server after Mongo connects
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    srv.listen(PORT, () => {
      console.log(`Server + Socket.io running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB error:', err));
