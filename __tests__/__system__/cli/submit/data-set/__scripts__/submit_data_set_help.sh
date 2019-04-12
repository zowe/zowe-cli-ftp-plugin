#!/bin/bash
set -e

echo "================z/OS VIEW SUBMIT DATA-SET HELP==============="
bright zos-ftp submit data-set --help

echo "================z/OS FTP SUBMIT DATA-SET HELP WITH RFJ==========="
bright zos-ftp submit data-set --help --rfj
