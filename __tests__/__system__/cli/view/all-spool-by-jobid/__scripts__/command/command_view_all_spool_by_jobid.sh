#!/bin/bash
jobid=$1
set -e

zowe zos-ftp view all-spool-by-jobid "$jobid"
