#!/usr/bin/env bash
cd /project

if [ -f "dist" ]; then
  rm -r dist
fi

npm run start:dev