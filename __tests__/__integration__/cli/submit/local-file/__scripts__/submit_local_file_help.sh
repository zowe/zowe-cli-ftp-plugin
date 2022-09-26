#!/bin/bash
set -e

echo "================z/OS VIEW SUBMIT LOCAL-FILE HELP==============="
zowe zos-ftp submit local-file --help

echo "================z/OS FTP SUBMIT LOCAL-FILE HELP WITH RFJ==========="
zowe zos-ftp submit local-file --help --rfj
