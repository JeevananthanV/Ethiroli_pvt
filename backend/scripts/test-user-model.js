import pool from '../src/config/database.js';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';

async function testUserAuth() {
  console.log('Testing User.findByEmail...');
  const student = await User.findByEmail('student@ethiroli.com');
  console.log('Found Student by email student@ethiroli.com:', student ? { id: student.id, email: student.email, name: student.full_name, role: student.role } : null);

  const admin = await User.findByEmail('admin@ethiroli.com');
  console.log('Found Admin by email admin@ethiroli.com:', admin ? { id: admin.id, email: admin.email, name: admin.full_name, role: admin.role } : null);

  const intern = await User.findByEmail('intern@ethiroli.com');
  console.log('Found Intern by email intern@ethiroli.com:', intern ? { id: intern.id, email: intern.email, name: intern.full_name, role: intern.role } : null);

  const tutor = await User.findByEmail('tutor@ethiroli.com');
  console.log('Found Tutor by email tutor@ethiroli.com:', tutor ? { id: tutor.id, email: tutor.email, name: tutor.full_name, role: tutor.role } : null);

  if (student) {
    const isStudentPass = await bcrypt.compare('Student@123', student.password_hash);
    console.log('Student password "Student@123" matches:', isStudentPass);
  }

  process.exit(0);
}

testUserAuth().catch(err => {
  console.error(err);
  process.exit(1);
});
