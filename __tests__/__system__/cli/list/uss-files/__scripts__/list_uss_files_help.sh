#!/bin/bash
set -e

echo "================z/OS FTP LIST USS-FILES HELP==============="
zowe zos-ftp list uss-files --help

echo "================z/OS FTP LIST USS-FILES HELP WITH RFJ==========="
zowe zos-ftp list uss-files --help --rfj
