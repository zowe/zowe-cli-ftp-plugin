#!/bin/bash
jobid=$1
set -e

echo "Getting list of spool files for $jobid"
bright zos-ftp list spool-files-by-jobid "$jobid"
