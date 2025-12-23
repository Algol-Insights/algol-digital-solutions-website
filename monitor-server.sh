#!/bin/bash

# Server Health Monitor
# Monitors the Next.js server and restarts it if it crashes

RETRY_DELAY=5
MAX_RETRIES=3
SERVER_URL="http://localhost:3007"
LOG_FILE="/tmp/server-monitor.log"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_message() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_server_health() {
    if lsof -Pi :3007 -sTCP:LISTEN -t >/dev/null 2>&1; then
        # Port is open, check if responding
        if curl -s -o /dev/null -w "%{http_code}" "$SERVER_URL" | grep -q "200\|301\|302"; then
            return 0  # Healthy
        else
            return 1  # Not responding
        fi
    else
        return 2  # Process not running
    fi
}

log_message "${GREEN}🔍 Server Health Monitor Started${NC}"
log_message "Monitoring: $SERVER_URL"
log_message "Log file: $LOG_FILE"

retries=0

while true; do
    check_server_health
    status=$?

    case $status in
        0)
            if [ $retries -gt 0 ]; then
                log_message "${GREEN}✓ Server recovered!${NC}"
                retries=0
            fi
            ;;
        1)
            log_message "${YELLOW}⚠ Server not responding (attempt $((retries+1))/$MAX_RETRIES)${NC}"
            retries=$((retries+1))
            ;;
        2)
            log_message "${RED}✗ Server process not running (attempt $((retries+1))/$MAX_RETRIES)${NC}"
            retries=$((retries+1))
            ;;
    esac

    if [ $retries -ge $MAX_RETRIES ]; then
        log_message "${RED}💥 Server has failed $MAX_RETRIES times. Manual intervention required.${NC}"
        log_message "Check the server logs for errors."
        log_message "To restart manually, run: ./start-stable.sh"
        exit 1
    fi

    sleep $RETRY_DELAY
done
