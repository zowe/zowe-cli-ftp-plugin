#!/bin/bash
pre=$1
owner=$2
set -e

zowe zos-ftp list jobs --prefix $pre --owner $owner
