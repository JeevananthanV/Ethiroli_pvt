async function testLoginEndpoint() {
  const baseURL = 'http://localhost:5000/api';
  console.log('Testing login endpoint at:', baseURL);

  const testAccounts = [
    { email: 'admin@ethiroli.com', password: 'Admin@123', portal: 'super-admin' },
    { email: 'tutor@ethiroli.com', password: 'Tutor@123', portal: 'tutor' },
    { email: 'student@ethiroli.com', password: 'Student@123', portal: 'student' },
    { email: 'intern@ethiroli.com', password: 'Intern@123', portal: 'intern' },
    { email: 'hr@ethiroli.com', password: 'Hr@123', portal: 'hr' },
  ];

  for (const acc of testAccounts) {
    try {
      console.log(`\nAttempting login for ${acc.email} on portal "${acc.portal}"...`);
      const res = await fetch(`${baseURL}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Portal': acc.portal
        },
        body: JSON.stringify({
          email: acc.email,
          password: acc.password,
          portal: acc.portal
        })
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`✅ Success for ${acc.email}: status ${res.status}`);
        console.log('User:', data?.data?.user?.email, 'Role:', data?.data?.user?.role);
        console.log('Token received:', data?.data?.token ? 'YES (length ' + data.data.token.length + ')' : 'NO');
      } else {
        console.error(`❌ Failed for ${acc.email}: status ${res.status}`, data);
      }
    } catch (err) {
      console.error(`❌ Error connecting for ${acc.email}:`, err.message);
    }
  }

  process.exit(0);
}

testLoginEndpoint().catch(console.error);
