const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const users = ['Rahul', 'Kamal', 'Sanak', 'Neha', 'Priya', 'Ravi', 'Simran', 'Aman', 'Deepak', 'Kiran'];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
}).then(async () => {
  console.log('🌱 Connected to DB for seeding');

  // Clear existing users
  await User.deleteMany({});

  // Insert new users
  for (const name of users) {
    await User.create({ name });
  }

  console.log('✅ 10 Users seeded successfully!');
  mongoose.disconnect();
}).catch(err => console.log(err));

