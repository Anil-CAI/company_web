#!/bin/bash
cd /home/abito/companie
pkill -f "next" 2>/dev/null
sleep 2
npm run build
npm run start -- -H 127.0.0.1 -p 8080
