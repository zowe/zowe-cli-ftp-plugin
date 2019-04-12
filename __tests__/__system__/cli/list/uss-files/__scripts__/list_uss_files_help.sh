#!/bin/bash
set -e

echo "================z/OS FTP LIST USS-FILES HELP==============="
bright zos-ftp list uss-files --help

echo "================z/OS FTP LIST USS-FILES HELP WITH RFJ==========="
bright zos-ftp list uss-files --help --rfj
