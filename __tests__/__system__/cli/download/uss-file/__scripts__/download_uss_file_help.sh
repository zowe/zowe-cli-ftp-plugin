#!/bin/bash
set -e

echo "================z/OS VIEW DOWNLOAD USS-FILE HELP==============="
zowe zos-ftp download uss-file --help

echo "================z/OS FTP DOWNLOAD USS-FILE HELP WITH RFJ==========="
zowe zos-ftp download uss-file --help --rfj