#!/bin/bash
set -e

echo "================z/OS FTP RENAME USS-FILE HELP ==============="
zowe zos-ftp rename uss-file --help

echo "================z/OS FTP RENAME USS-FILE HELP WITH RFJ==========="
zowe zos-ftp mv uss --help --rfj

