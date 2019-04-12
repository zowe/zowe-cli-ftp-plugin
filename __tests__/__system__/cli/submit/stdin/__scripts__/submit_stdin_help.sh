#!/bin/bash
set -e

echo "================z/OS VIEW SUBMIT STDIN HELP==============="
bright zos-ftp submit stdin --help

echo "================z/OS FTP SUBMIT STDIN HELP WITH RFJ==========="
bright zos-ftp submit stdin --help --rfj
