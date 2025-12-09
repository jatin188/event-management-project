require('dotenv').config();
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seed() {
  try {
    await connectDB();
    const users = [
      { name: 'System Administrator', email: 'admin@eventhorizon.com', password: 'admin123', role: 'ADMIN' },
      { name: 'Alice Tester', email: 'alice@test.com', password: 'password123', role: 'USER' },
      { name: 'Bob Tester', email: 'bob@test.com', password: 'passw0rd', role: 'USER' }
    ];
    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) { console.log(`User ${u.email} exists — skipping`); continue; }
      const hash = await bcrypt.hash(u.password, 10);
      await User.create({ name: u.name, email: u.email, passwordHash: hash, role: u.role, isVerified: true });
      console.log(`Created ${u.email}`);
    }
    console.log('Seeding complete');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
seed();
