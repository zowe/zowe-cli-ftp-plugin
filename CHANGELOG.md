# Changelog

All notable changes to the z/OS FTP Plug-in for Zowe CLI will be documented in this file.

## `3.0.0-next.202406041826`

- Fix list spool file hang problem.

## `3.0.0-next.202403191358`

- Major: Zowe V3 release

- **Enhancements**:
  - The following properties, interfaces, and/or functions were added:
    - `zosNodeAccessor` as namespaces for the entire `zos-node-accessor` package.
    - `TransferMode` from the `zos-node-accessor` package.
    - `JobUtils.downloadSpoolContent`
    - `JobUtils.getSpoolDownloadFilePath`
    - `IListJobOption.jobName`
    - `IListJobOption.jobId`
    - `IConnectionOption`
      - For a full list of transfer modes, see [ConnectionOption by `zos-node-accessor`](https://github.com/IBM/zos-node-accessor/blob/faf55873f37cc40e927f1b1c19f697de8cf08b95/src/interfaces/ConnectionOption.ts#L17)
    - `IDatasetEntry`
      - For a full list of transfer modes, see [DatasetEntry by `zos-node-accessor`](https://github.com/IBM/zos-node-accessor/blob/faf55873f37cc40e927f1b1c19f697de8cf08b95/src/interfaces/DatasetEntry.ts#L17)
    - `IUSSEntry`
      - For a full list of transfer modes, see [USSEntry by `zos-node-accessor`](https://github.com/IBM/zos-node-accessor/blob/faf55873f37cc40e927f1b1c19f697de8cf08b95/src/interfaces/USSEntry.ts#L19)
- **Breaking**:
  - Removed the following constants, interfaces, and other values:
    - `IGetSpoolFileOption.jobName`
    - `JobUtils.parseJobDetails`
    - `CoreUtils.addLowerCaseKeysToObject`
  - Added proper typing to the parameters of the following functions:
    - `CreateDataset.create`
    - `DataSetUtils.listDataSets`
    - `FTPConfig.connectFromArguments`
      - Return type changed: `Promise<any> --> Promise<ZosAccessor>`
    - `FTPConfig.createConfigFromArguments`
      - Return type changed: `any --> IConnectionOption`
    - `JobUtils.getSpoolFileContent`
      - Return type changed: `Promise<Buffer> --> Promise<string>`
    - `JobUtils.getSpoolFiles`
    - `JobUtils.submitJob`
    - `JobUtils.submitJobFromDataset`
    - `JobUtils.findJobByID`
    - `JobUtils.listJobs`
    - `JobUtils.deleteJob`
    - `UssUtils.listFiles`
      - Return type changed: `Promise<any[]> --> Promise<IUSSEntry[]>`
    - `UssUtils.makeDirectory`
    - `UssUtils.renameFile`
    - `UssUtils.deleteFile`
    - `UssUtils.downloadFile`
    - `UssUtils.uploadFile`
    - `UssUtils.deleteDirectory`
    - `DataSetUtils.listDataSets`
      - Return type changed: `Promise<any[]> --> Promise<IDatasetEntry[]>`
    - `DataSetUtils.listMembers`
      - Return type changed: `Promise<any[]> --> Promise<IDatasetEntry[]>`
    - `DataSetUtils.deleteDataSet`
    - `DataSetUtils.renameDataSet`
    - `DataSetUtils.downloadDataSet`
    - `DataSetUtils.uploadDataSet`
    - `DataSetUtils.allocateDataSet`
    - `AbstractTemplatedJCL.getJcl`
  - The properties in the interfaces below have changed:
    - `IDownloadFileOption.transferType?: string` to `IDownloadFileOption.transferType?: zna.TransferMode`
    - `IUploadFileOption.transferType?: string` to `IUploadFileOption.transferType?: zna.TransferMode`
    - `IUploadDataSetOption.transferType?: string` to `IUploadDataSetOption.transferType?: zna.TransferMode`
    - `ISpoolFile.id: string` to `ISpoolFile.id: number`
    - `ISpoolFile.stepname: string` to `ISpoolFile.stepName: string`
    - `ISpoolFile.procstep: string` to `ISpoolFile.procStep: string`
    - `ISpoolFile.ddname: string` to `ISpoolFile.ddName: string`
    - `ISpoolFile.ddname: string` to `ISpoolFile.ddName: string`
    - `IJobStatus.jobname: string` to `IJobStatus.jobName: string`
    - `IJobStatus.jobid: string` to `IJobStatus.jobId: string`
    - `IJob.jobname: string` to `IJob.jobName: string`
    - `IJob.jobid: string` to `IJob.jobId: string`
    - `IGetSpoolFileOption.fileId: string` to `IGetSpoolFileOption.fileId: number`

## `2.1.8`

- BugFix: Upload dataset using Buffer, stead of string. [2533](https://github.com/zowe/vscode-extension-for-zowe/issues/2533)
- Simplify the preparation for JCL system tests


## `2.1.7`

- Update the version of zos-node-accessor to 1.0.16


## `2.1.6`

- BugFix: Add missing npm-shrinkwrap

## `2.1.5`

- Add checking the uss file path when upload file or stdin to uss file.

## `2.1.4`
- BugFix: Provide new utility function that checks file names for valid characters [143](https://github.com/zowe/zowe-cli-ftp-plugin/issues/143).

## `2.1.3`

- Update example of `upload file-to-data-set` command.

## `2.1.2`

- Updated the  `zos-node-accessor` package to 1.0.14 for technical currency.

## `2.1.1`

- Throw error when list jobs with invalid prefix or owner.

## `2.1.0`

- Add encoding setting in profile.
- Support list jobs by status.

## `2.0.2`

- Refine help of partitioned dataset allocation.

## `2.0.1`

- Pick up `zos-node-accessor` v1.0.11 to fix listing single USS file or symbol link and update PDS dataset allocation.

## `2.0.0`

- Major: Updated for V2 compatibility. See the prerelease items below for more details.

## `2.0.0-next.202204131412`

- Updated the plug-in to meet Zowe v2 conformance criteria.

## `2.0.0-next.202204111437`

- Publish `@next` tag that is compatible with Zowe v2 daemon mode and team config profiles.

## `1.8.7`

- Change the profile fields from required to optional to compatible with base profile.

## `1.8.6`

- BugFix: Refine error message of uploading partition dataset member.
          Refine description of parameter dcb of uploading sequential dataset.
- Change `bright` command to `zowe` in test scripts.

## `1.8.5`

- BugFix: Pruned dev dependencies from npm-shrinkwrap file.

## `1.8.4`

- BugFix: Included an npm-shrinkwrap file to lock-down all transitive dependencies.

## `1.8.3`
- Fix `download uss-file` and `view uss-file` the file under the directory of symbol link.

## `1.8.2`
- Add some second shortcuts to match with zowe core CLI options.

## `1.8.1`
- Fix Windows path problem when using `delete uss-file` command.

## `1.8.0`
- Support listing USS files with file name pattern containing *.

## `1.7.0`

- Support listing loadlib members
- Clear password error message
- Support listing jobs without default prefix *.

## `1.6.0`

- Added --rdw to `download dataset` command to download variable-length dataset.

## `1.5.0`

- Expose meta data for Zowe Explorer FTP extension.
- Add `retcode` in the output of the `view job-status-by-jobid` and `submit` command to be consistent with ZOSMF plugin.

## `1.4.1`

- Fixed list jobs problems.
- Updated list jobs unit test and system test.

## `1.4.0`

- Add allocate command to allocate sequential or partitioned dataset.

## `1.3.0`

- Move the reusable code from handlers to api folder.

## `1.2.1`

- BugFix: Fixed an issue where the `view spool-file-by-id` command retrieved incorrect contents. [#61](https://github.com/zowe/zowe-cli-ftp-plugin/issues/61)

## `1.2.0`

- Added three options for submit job: --wait, --wait-for-output, --wait-for-active.

## `1.1.0`

- Added two commands: list data-set-members and make uss-directory.

## `1.0.2`

- Fixed example quotes for uploading a file to a dataset.

## `1.0.1`

- Changed packaged dependency versioning to lock down version of zos-node-accessor

## `1.0.0`

- Plugin released

