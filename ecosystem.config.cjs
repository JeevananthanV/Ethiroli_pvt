/**
 * Ethiroli PM2 Enterprise Cluster Ecosystem Configuration
 * Usage:
 *   pm2 start ecosystem.config.cjs --env production
 *   pm2 reload ecosystem.config.cjs  # Zero-downtime rolling reload
 *   pm2 monit
 */

module.exports = {
  apps: [
    {
      name: 'ethiroli-api-cluster',
      script: './backend/src/server.js',
      // Cluster mode forks processes across available CPU cores
      instances: process.env.PM2_INSTANCES || 'max',
      exec_mode: 'cluster',

      // Automatic memory guard: restarts worker if it leaks over 500MB
      max_memory_restart: '500M',

      // Timeouts for graceful zero-downtime rolling restarts
      listen_timeout: 10000,
      kill_timeout: 5000,
      wait_ready: true,

      // Auto-restart behavior on uncaught exceptions
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,

      // Logging configuration
      error_file: './logs/pm2-cluster-error.log',
      out_file: './logs/pm2-cluster-out.log',
      merge_logs: true,
      time: true,

      env: {
        NODE_ENV: 'development',
        PORT: 5000,
        CLUSTER_MODE: 'true',
        DB_POOL_SIZE: 15
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        CLUSTER_MODE: 'true',
        DB_POOL_SIZE: 10
      }
    }
  ]
};
