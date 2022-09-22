#!/bin/bash
set -e

echo "================z/OS FTP VIEW USS-FILE HELP ==============="
zowe zos-ftp view uss-file --help

echo "================z/OS FTP VIEW USS-FILE HELP WITH RFJ==========="
zowe zos-ftp vw uss --help --rfj
