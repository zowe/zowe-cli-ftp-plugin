#!/bin/bash
set -e

echo "================z/OS FTP UPLOAD STDIN-TO-DATA-SET HELP ==============="
bright zos-ftp upload stdin-to-data-set --help

echo "================z/OS FTP UPLOAD STDIN-TO-DATA-SET HELP WITH RFJ==========="
bright zos-ftp ul stds --help --rfj
