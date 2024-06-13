#!/bin/bash

# Name of the PM2 process
PROCESS_NAME="tote-api"

# Command to start the process
START_CMD="npm run start:prod"

# Check if the process is already running
if pm2 list | grep -q $PROCESS_NAME; then
    # If the process is running, restart it
    echo "Restarting $PROCESS_NAME..."
    pm2 restart $PROCESS_NAME
else
    # If the process is not running, start it
    echo "Starting $PROCESS_NAME..."
    pm2 start npm --name "$PROCESS_NAME" -- run start:prod
fi

# Save the PM2 process list (optional)
pm2 save
