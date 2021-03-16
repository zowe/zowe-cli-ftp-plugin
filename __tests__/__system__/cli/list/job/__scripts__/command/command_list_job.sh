#!/bin/bash
pre=$1
owner=$2
set -e

bright zos-ftp list jobs --prefix $pre --owner $owner
