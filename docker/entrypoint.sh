#!/bin/sh

echo Compiling contracts...
npx hardhat compile

echo Starting local blockchain...
npx hardhat node &
sleep 5

echo Deploying contracts...
node scripts/deploy.ts

echo System is ready
tail -f /dev/zero
