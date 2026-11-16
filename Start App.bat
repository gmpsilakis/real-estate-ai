@echo off
title InvestIQ - Real Estate Dashboard
echo Starting InvestIQ...
cd /d "%~dp0"

:: Open browser after 4 seconds (server needs time to start)
start /b cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:3000"

:: Start the dev server (this window stays open — close it to stop the app)
npm run dev
