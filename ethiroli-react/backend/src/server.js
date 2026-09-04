import http from 'http';
import app from './app.js';
import initSocketServer from './socket/index.js';
import pool from './config/database.js';
import bcrypt from 'bcrypt';

const PORT = process.env.PORT || 5000;
const SOCKET_PORT = 3003;

const seedAdminUser = async () => {
  try {
    const [rows] = await pool.execute("SELECT id FROM users WHERE email = 'admin@ethiroli.com' OR role = 'SUPER_ADMIN'");
    if (rows.length === 0) {
      // Seed default SUPER_ADMIN
      const passwordHash = await bcrypt.hash('123', 10);
      const email = 'admin@ethiroli.com'; // Note: In User model email is deterministic-encrypted. Let's use User.create or insert manually
      // We will insert manually or let User.create do it. Since User.create does it correctly, let's import User.
      const { default: User } = await import('./models/User.js');
      await User.create({
        email,
        password_hash: passwordHash,
        full_name: 'Super Administrator',
        role: 'SUPER_ADMIN'
      });
      console.log('Seeded default SUPER_ADMIN user.');
    }
  } catch (error) {
    console.error('Error seeding default admin user:', error);
  }
};

// Start Express Server
app.listen(PORT, async () => {
  console.log(`API Server running on http://localhost:${PORT}`);
  await seedAdminUser();
});

// Start standalone Socket.IO Server on port 3003
const socketServer = http.createServer();
initSocketServer(socketServer);
socketServer.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO Server running on http://localhost:${SOCKET_PORT}`);
});
