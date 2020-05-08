#!/bin/bash
dsn=$1
set -e

bright zos-ftp list data-set-members "$dsn"