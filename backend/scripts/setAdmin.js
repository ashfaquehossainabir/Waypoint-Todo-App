/**
 * Promote a user to admin.
 *
 * Usage:
 *   node scripts/setAdmin.js user@example.com
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: node scripts/setAdmin.js <email>');
    process.exit(1);
  }

  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo-app';
  await mongoose.connect(uri);

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { role: 'admin' },
    { new: true }
  );

  if (!user) {
    console.error(`No user found with email "${email}".`);
  } else {
    console.log(`✔ ${user.email} is now an admin.`);
  }

  await mongoose.disconnect();
  process.exit(user ? 0 : 1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
