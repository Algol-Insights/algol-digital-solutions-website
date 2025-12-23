# Server Management Guide

## Quick Start Commands

### Start the Server
```bash
pm2 start ecosystem.config.js
```

### Check Status
```bash
pm2 status
```

### View Logs
```bash
pm2 logs algol-website
```

### Restart Server
```bash
pm2 restart algol-website
```

### Stop Server
```bash
pm2 stop algol-website
```

### Monitor in Real-Time
```bash
pm2 monit
```

## Server Stability Features

### PM2 Configuration
The server is now managed by PM2 with the following stability features:

1. **Auto-Restart on Crash**: Automatically restarts if the process crashes
2. **Memory Limit**: Restarts if memory usage exceeds 1GB
3. **Restart Delay**: 4-second delay between restarts to prevent rapid cycling
4. **Exponential Backoff**: Increases delay exponentially if crashes continue
5. **Max Restarts**: Limited to 10 restarts within 60 seconds to prevent infinite loops
6. **Log Management**: All logs saved to `~/.pm2/logs/`

### Current Server Status
- **Process Manager**: PM2
- **Port**: 3007
- **Memory Allocation**: 4GB Node heap size
- **Auto-Restart**: Enabled
- **Max Memory**: 1GB before restart

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3007
fuser -k 3007/tcp

# Restart PM2
pm2 restart algol-website
```

### Memory Issues
```bash
# Check memory usage
pm2 status

# If memory is high, restart
pm2 restart algol-website
```

### Server Won't Start
```bash
# Check logs for errors
pm2 logs algol-website --lines 50

# Delete PM2 process and start fresh
pm2 delete algol-website
pm2 start ecosystem.config.js
```

### Database Connection Issues
```bash
# Check PostgreSQL status
docker ps | grep postgres

# Restart PostgreSQL if needed
docker restart $(docker ps -q --filter "ancestor=postgres:17.2-alpine")
```

## Development Workflow

### Making Code Changes
Code changes are automatically detected by Next.js Turbopack. No need to restart PM2.

### Checking for Errors
```bash
# View real-time logs
pm2 logs algol-website --lines 100

# Check for TypeScript errors
npm run type-check
```

### Testing Endpoints
```bash
# Test products API
curl http://localhost:3007/api/products?limit=5

# Test limited time offers
curl 'http://localhost:3007/api/products?limitedTimeOffer=true&limit=8'

# Test homepage
curl -I http://localhost:3007
```

## PM2 Advanced Commands

### Save Process List
```bash
# Save current PM2 processes
pm2 save
```

### Startup Script (Auto-start on reboot)
```bash
# Generate startup script
pm2 startup

# Follow the displayed instructions
```

### Monitor Multiple Metrics
```bash
# Real-time monitoring dashboard
pm2 monit

# Process info
pm2 info algol-website

# Show all metadata
pm2 describe algol-website
```

### Log Management
```bash
# View logs
pm2 logs algol-website

# Flush logs
pm2 flush

# Show only errors
pm2 logs algol-website --err

# Show only output
pm2 logs algol-website --out
```

## Performance Optimization

### Memory Management
The server is configured with:
- Node heap size: 4GB (`--max-old-space-size=4096`)
- PM2 restart threshold: 1GB
- Automatic garbage collection optimization

### Process Monitoring
PM2 tracks:
- CPU usage
- Memory consumption
- Restart count
- Uptime
- Response time

### Best Practices
1. **Check logs regularly**: `pm2 logs algol-website`
2. **Monitor memory**: `pm2 status` or `pm2 monit`
3. **Review restart count**: High restart count indicates issues
4. **Keep PM2 updated**: `npm install -g pm2@latest`
5. **Save PM2 configuration**: `pm2 save` after changes

## Common Issues & Solutions

### Issue: Frequent Restarts
**Cause**: Memory leaks, infinite loops, or uncaught exceptions

**Solution**:
```bash
# Check logs for errors
pm2 logs algol-website --lines 100

# Increase memory limit if needed (edit ecosystem.config.js)
max_memory_restart: '2G'

# Restart with new config
pm2 restart algol-website --update-env
```

### Issue: Slow Response Times
**Cause**: Heavy database queries or large API responses

**Solution**:
- Enable API caching (already implemented)
- Review slow queries in logs
- Check database connection pool

### Issue: Port Conflicts
**Cause**: Multiple processes trying to use port 3007

**Solution**:
```bash
# Find and kill process
lsof -ti:3007 | xargs kill -9

# Or use fuser
fuser -k 3007/tcp

# Restart
pm2 restart algol-website
```

## Environment Variables

Required environment variables (in `.env.local`):
```env
DATABASE_URL=postgresql://localhost:5432/algol_digital_solutions
NEXTAUTH_URL=http://localhost:3007
NEXTAUTH_SECRET=your-secret-key
NODE_OPTIONS=--max-old-space-size=4096
```

## Production Deployment

For production on Vercel, PM2 is not needed as Vercel handles process management. However, for self-hosted deployments:

```bash
# Production mode
NODE_ENV=production pm2 start ecosystem.config.js --env production

# Build first
npm run build

# Then start with PM2
pm2 start npm --name "algol-website-prod" -- start
```

## Health Check

Test server health with:
```bash
curl http://localhost:3007/api/products?limit=1
```

Expected response: JSON with product data

---

**Last Updated**: December 23, 2025
**PM2 Version**: Latest
**Node Version**: v20.x
