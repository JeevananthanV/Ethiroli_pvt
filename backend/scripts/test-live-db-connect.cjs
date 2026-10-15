const mysql = require('mysql2/promise');

async function testConnection(host) {
  console.log(`Testing connection to ${host}...`);
  try {
    const connection = await mysql.createConnection({
      host: host,
      user: 'u629721489_ethiroli_pvt',
      password: 'Ethiroliadmin@123',
      database: 'u629721489_ethiroli_Db',
      connectTimeout: 5000
    });
    console.log(`Connected successfully to ${host}!`);
    await connection.end();
    return true;
  } catch (err) {
    console.log(`Failed to connect to ${host}:`, err.message);
    return false;
  }
}

async function run() {
  const hosts = ['ethiroli.net', 'www.ethiroli.net'];
  for (const h of hosts) {
    await testConnection(h);
  }
}

run();
