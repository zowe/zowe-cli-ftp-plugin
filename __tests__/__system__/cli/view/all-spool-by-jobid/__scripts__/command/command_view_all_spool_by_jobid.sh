#!/bin/bash
jobid=$1
set -e

bright zos-ftp view all-spool-by-jobid "$jobid"
