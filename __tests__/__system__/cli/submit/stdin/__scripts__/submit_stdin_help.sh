#!/bin/bash
set -e

echo "================z/OS VIEW SUBMIT STDIN HELP==============="
zowe zos-ftp submit stdin --help

echo "================z/OS FTP SUBMIT STDIN HELP WITH RFJ==========="
zowe zos-ftp submit stdin --help --rfj
