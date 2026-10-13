#!/bin/sh
curl -s -X POST --data-binary @"$1" http://localhost:8790/
