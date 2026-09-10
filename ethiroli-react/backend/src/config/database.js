import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'ethiroli',
  waitForConnections: true,
  connectionLimit: 10,
});

export const checkDatabaseHealth = async (poolInstance) => {
  const start = Date.now();
  try {
    const [rows] = await poolInstance.execute('SELECT 1 AS health_check');
    const latencyMs = Date.now() - start;
    return { connected: true, latencyMs };
  } catch (error) {
    return { connected: false, latencyMs: Date.now() - start, error: error.message };
  }
};

export const logPoolStatus = (poolInstance) => {
  try {
    const status = poolInstance.pool ?? {};
    const info = {
      timestamp: new Date().toISOString(),
      totalConnections: status._allConnections?.length ?? 'N/A',
      freeConnections: status._freeConnections?.length ?? 'N/A',
      queue: status._connectionQueue?.length ?? 'N/A'
    };
    console.log(JSON.stringify({ level: 'info', message: 'DB pool status', ...info }));
  } catch (_) {
    // Pool status may not be available in all mysql2 versions
  }
};

export const getPoolStats = async () => {
  try {
    const status = pool.pool ?? {};
    const active = status._allConnections?.length ?? 0;
    const idle = status._freeConnections?.length ?? 0;
    return { active, idle, total: active };
  } catch (_) {
    return { active: 0, idle: 0, total: 0 };
  }
};

export const getDatabaseHealth = async () => {
  const dbHealth = await checkDatabaseHealth(pool);
  return {
    status: dbHealth.connected ? 'healthy' : 'unhealthy',
    database: dbHealth,
    timestamp: new Date().toISOString()
  };
};

export default pool;