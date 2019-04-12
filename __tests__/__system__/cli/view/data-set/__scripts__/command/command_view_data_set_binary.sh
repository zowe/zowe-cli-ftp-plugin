#!/bin/bash
dsn=$1
set -e

bright zos-ftp view ds "$dsn" -b