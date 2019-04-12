#!/bin/bash
set -e

echo "================z/OS VIEW LIST SPOOL-FILES-BY-JOBID HELP==============="
bright zos-ftp list spool-files-by-jobid --help

echo "================z/OS FTP LIST SPOOL-FILES-BY-JOBID HELP WITH RFJ==========="
bright zos-ftp list spool-files-by-jobid --help --rfj
