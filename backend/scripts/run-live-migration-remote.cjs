const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runLiveMigration() {
  const sqlFile = path.join(__dirname, '..', 'live_production_update.sql');
  if (!fs.existsSync(sqlFile)) {
    console.error('live_production_update.sql not found at:', sqlFile);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlFile, 'utf8');

  // Split into individual SQL statements
  const statements = sqlContent
    .split(/;\s*[\r\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Loaded ${statements.length} SQL statements to execute.`);

  const connectionConfig = {
    host: process.env.LIVE_DB_HOST || 'ethiroli.net',
    port: Number(process.env.LIVE_DB_PORT || 3306),
    user: process.env.LIVE_DB_USER || 'u629721489_ethiroli_pvt',
    password: process.env.LIVE_DB_PASSWORD || 'Ethiroliadmin@123',
    database: process.env.LIVE_DB_NAME || 'u629721489_ethiroli_Db',
    multipleStatements: true,
    connectTimeout: 10000
  };

  console.log(`Connecting to ${connectionConfig.host}:${connectionConfig.port} as ${connectionConfig.user}...`);

  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log('Successfully connected to live database!');
  } catch (err) {
    console.error('\nConnection failed:', err.message);
    if (err.code === 'ETIMEDOUT' || err.message.includes('ETIMEDOUT')) {
      console.error('\nNOTE: Hostinger blocks external connections to port 3306 by default.');
      console.error('To allow this script to run directly:');
      console.error('1. Go to Hostinger hPanel -> Databases -> Remote MySQL.');
      console.error('2. Add your IP or % (any host) for database u629721489_ethiroli_Db.');
    }
    process.exit(1);
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await connection.query(stmt);
      successCount++;
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('Duplicate column')) {
        successCount++;
      } else {
        errorCount++;
        console.error(`Error on statement #${i + 1}:`, err.message);
        console.error('Statement snippet:', stmt.slice(0, 150));
      }
    }
  }

  console.log('\n=======================================');
  console.log(`Migration Complete: ${successCount} statements executed successfully, ${errorCount} errors.`);
  console.log('=======================================');

  await connection.end();
}

runLiveMigration().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
