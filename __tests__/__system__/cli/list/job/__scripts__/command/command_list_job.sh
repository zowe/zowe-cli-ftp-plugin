#!/bin/bash
pre=$1
set -e

bright zos-ftp list jobs --prefix $pre
