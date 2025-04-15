@echo off
echo Starting Solana Test Validator with admin privileges...
echo This script must be run as administrator to work properly.
echo.

REM Set environment variables
set RUST_BACKTRACE=1

REM Start the Solana test validator
solana-test-validator

pause
