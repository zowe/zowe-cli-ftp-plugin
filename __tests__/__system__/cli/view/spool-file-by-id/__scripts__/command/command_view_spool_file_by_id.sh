#!/bin/bash
jobid=$1
spoolid=$2
set -e

zowe zos-ftp view spool-file-by-id "$jobid" "$spoolid"