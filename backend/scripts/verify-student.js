import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import pool from '../src/config/database.js';

async function main() {
  try {
    let student = await User.findByEmail('student@ethiroli.com');
    console.log('Existing student lookup:', student ? { id: student.id, email: student.email, role: student.role } : 'None');

    const passwordHash = await bcrypt.hash('Student@123', 10);

    if (!student) {
      const newId = await User.create({
        email: 'student@ethiroli.com',
        password_hash: passwordHash,
        full_name: 'Ethiroli Student',
        phone: '9876543210',
        role: 'STUDENT',
        preferences: { notification_email: true }
      });
      console.log('Created student user successfully with ID:', newId);
    } else {
      await User.update(student.id, {
        password_hash: passwordHash,
        role: 'STUDENT',
        is_active: 1
      });
      console.log('Updated existing student user password and active status');
    }

    const verified = await User.findByEmail('student@ethiroli.com');
    console.log('Verified student in DB:', {
      id: verified.id,
      email: verified.email,
      role: verified.role,
      fullName: verified.full_name
    });

    const isMatch = await bcrypt.compare('Student@123', verified.password_hash);
    console.log('Password match test result:', isMatch);

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Error verifying/seeding student:', err);
    process.exit(1);
  }
}

main();
