#!/bin/bash
set -e

echo "================z/OS FTP RENAME USS-FILE HELP ==============="
bright zos-ftp rename uss-file --help

echo "================z/OS FTP RENAME USS-FILE HELP WITH RFJ==========="
bright zos-ftp mv uss --help --rfj

