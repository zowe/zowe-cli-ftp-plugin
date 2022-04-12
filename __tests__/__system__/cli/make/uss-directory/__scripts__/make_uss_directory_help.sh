#!/bin/bash
set -e

echo "================z/OS FTP VIEW USS-FILE HELP ==============="
zowe zos-ftp make uss-directory --help

echo "================z/OS FTP VIEW USS-FILE HELP WITH RFJ==========="
zowe zos-ftp make uss-directory --help --rfj