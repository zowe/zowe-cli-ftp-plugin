#!/bin/bash
jobid=$1
set -e

bright zos-ftp download all-spool-by-jobid "$jobid"