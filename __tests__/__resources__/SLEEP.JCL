//SLEEP JOB MSGLEVEL=(1,1),NOTIFY=&SYSUID,MSGCLASS=A 
//SLEEP EXEC PGM=AOPBATCH,PARM='sleep 20' 
//STDOUT DD SYSOUT=* 
//STDERR DD SYSOUT=* 
//STDIN DD DUMMY