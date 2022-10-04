#!/bin/bash
set -e

echo "================z/OS FTP LIST DATA-SET HELP==============="
zowe zos-ftp list jobs --help

echo "================z/OS FTP LIST DATA-SET HELP WITH RFJ==========="
zowe zos-ftp list jobs --help --rfj
