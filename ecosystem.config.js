module.exports = {
  apps: [
    {
      name: 'algol-website',
      script: 'npm',
      args: 'run dev',
      cwd: '/workspaces/algol-digital-solutions-website',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3007,
        NODE_OPTIONS: '--max-old-space-size=4096'
      },
      error_file: '/home/codespace/.pm2/logs/algol-website-error.log',
      out_file: '/home/codespace/.pm2/logs/algol-website-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      exp_backoff_restart_delay: 100,
      listen_timeout: 10000,
      kill_timeout: 5000,
    }
  ]
}
