# Server Stability Guide

## Current Status ✅

The development server is running with the following stability improvements:

- **Next.js 16.0.10** with Turbopack enabled
- **Node.js memory limit**: Increased to 4GB (`--max-old-space-size=4096`)
- **PostgreSQL**: Running in Docker container (algol-postgres)
- **Port**: 3007
- **URL**: http://localhost:3007

## Stability Improvements Implemented

### 1. Enhanced npm Scripts

Updated `package.json` with:
```json
"dev": "next dev -p 3007 --turbopack"
"dev:stable": "NODE_OPTIONS='--max-old-space-size=4096' next dev -p 3007 --turbopack"
```

**Benefits:**
- Turbopack for faster, more stable hot reloading
- Increased memory prevents crashes on large projects
- Separate stable mode for production-like development

### 2. Startup Scripts

#### `start-stable.sh` - Comprehensive Startup
Handles:
- PostgreSQL container verification
- Prisma client generation
- Database schema sync
- Port conflict resolution
- Cache clearing
- Memory-optimized Node.js

**Usage:**
```bash
./start-stable.sh
```

#### `monitor-server.sh` - Health Monitoring
Monitors server health and logs issues:
- Checks port 3007 every 5 seconds
- Logs to `/tmp/server-monitor.log`
- Alerts after 3 consecutive failures

**Usage (in separate terminal):**
```bash
./monitor-server.sh
```

### 3. Memory Management

**Node.js Options Set:**
- `--max-old-space-size=4096`: 4GB heap memory
- `--max-http-header-size=32768`: Larger HTTP headers

**Why This Helps:**
- Next.js 16 with Turbopack can be memory-intensive
- Large codebase requires more heap space
- Prevents "JavaScript heap out of memory" errors

### 4. Turbopack Advantages

Enabled with `--turbopack` flag:
- 700x faster updates than Webpack
- Incremental compilation
- Better error recovery
- Reduced memory footprint
- More stable hot reloading

## Common Crash Causes & Solutions

### Issue 1: Port Already in Use

**Symptom:** `EADDRINUSE: address already in use :::3007`

**Solution:**
```bash
# Kill process on port 3007
kill -9 $(lsof -ti:3007)

# Then restart
./start-stable.sh
```

### Issue 2: Out of Memory

**Symptom:** `JavaScript heap out of memory`

**Solution:**
```bash
# Already fixed with NODE_OPTIONS
# But if it still happens:
NODE_OPTIONS="--max-old-space-size=8192" npm run dev
```

### Issue 3: Prisma Client Not Generated

**Symptom:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
npx prisma generate
npm run dev
```

### Issue 4: Database Connection Failed

**Symptom:** `Can't reach database server`

**Solution:**
```bash
# Check if container is running
docker ps | grep postgres

# Start container if needed
docker start algol-postgres

# Verify connection
docker exec -it algol-postgres psql -U postgres -d algol_digital_solutions -c "SELECT 1;"
```

### Issue 5: Module Resolution Errors

**Symptom:** `Module not found` or `Cannot resolve module`

**Solution:**
```bash
# Clear all caches
rm -rf .next node_modules/.cache

# Reinstall dependencies
npm install

# Restart server
npm run dev:stable
```

## Best Practices for Stability

### 1. Development Workflow

**When making changes:**
1. Save files (auto-reload with Turbopack)
2. Wait for compilation to complete
3. Don't refresh browser during compilation
4. Check terminal for errors before testing

**When experiencing issues:**
1. Stop server (Ctrl+C)
2. Clear `.next` cache: `rm -rf .next`
3. Restart with `./start-stable.sh`

### 2. Docker Management

**Keep PostgreSQL healthy:**
```bash
# Check container health
docker ps

# View logs
docker logs algol-postgres

# Restart if needed
docker restart algol-postgres
```

### 3. Resource Monitoring

**Monitor resource usage:**
```bash
# Check Node.js memory usage
ps aux | grep node

# Check disk space
df -h

# Check available memory
free -h
```

### 4. Error Handling

**When errors occur:**
1. Read error message carefully
2. Check terminal output
3. Review browser console
4. Check `/tmp/server-monitor.log` if monitoring
5. Restart cleanly with startup script

## Production Deployment Recommendations

### Memory Settings for Vercel

Add to `vercel.json`:
```json
{
  "build": {
    "env": {
      "NODE_OPTIONS": "--max-old-space-size=4096"
    }
  }
}
```

### Environment Variables

Required for production:
```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<generate-secure-secret>
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
```

### Build Configuration

Optimize `next.config.ts`:
```typescript
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
}
```

## Monitoring in Production

### 1. Error Tracking
- Use Sentry or similar service
- Monitor API endpoint response times
- Track database query performance

### 2. Performance Metrics
- Core Web Vitals (LCP, FID, CLS)
- Time to First Byte (TTFB)
- API latency

### 3. Health Checks
- `/api/health` endpoint
- Database connectivity
- External service status

## Quick Reference Commands

```bash
# Start server (stable mode)
./start-stable.sh

# Start server (manual)
npm run dev:stable

# Monitor server health
./monitor-server.sh

# Kill crashed server
kill -9 $(lsof -ti:3007)

# Clear Next.js cache
rm -rf .next

# Regenerate Prisma client
npx prisma generate

# Sync database schema
npx prisma db push

# View server logs
tail -f /tmp/server-monitor.log

# Check running processes
ps aux | grep node

# Test API endpoint
curl http://localhost:3007/api/products
```

## Troubleshooting Checklist

When server crashes, check:

- [ ] Is PostgreSQL container running? (`docker ps`)
- [ ] Is port 3007 available? (`lsof -i :3007`)
- [ ] Is Prisma client generated? (`ls node_modules/.prisma/client`)
- [ ] Are environment variables set? (`cat .env`)
- [ ] Is disk space sufficient? (`df -h`)
- [ ] Is memory available? (`free -h`)
- [ ] Are node_modules intact? (`ls node_modules/@prisma`)
- [ ] Is .next cache corrupted? (try `rm -rf .next`)

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Turbopack**: https://turbo.build/pack/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Project Logs**: `/tmp/server-monitor.log`

---

**Last Updated**: December 23, 2025
**Server Version**: Next.js 16.0.10
**Node Version**: $(node --version)
