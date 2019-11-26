#!/bin/bash
set -e

echo "================z/OS FTP LIST DATA-SET HELP==============="
bright zos-ftp list jobs --help

echo "================z/OS FTP LIST DATA-SET HELP WITH RFJ==========="
bright zos-ftp list jobs --help --rfj
