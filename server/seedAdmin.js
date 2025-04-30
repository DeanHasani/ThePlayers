require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI);

const seedAdmin = async () => {
  await User.deleteMany({ role: 'admin' });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin1234', salt);
  const admin = new User({
    name: 'Admin',           
    surname: 'Super User',         
    phone: '123-456-7890',   
    email: 'admin@gmail.com',
    password: hashedPassword,
    role: 'admin',
  });
  await admin.save();
  console.log('Admin user seeded');
  mongoose.connection.close();
};

seedAdmin();