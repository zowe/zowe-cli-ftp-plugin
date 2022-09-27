# Changelog

All notable changes to the z/OS FTP Plug-in for Zowe CLI will be documented in this file.

## Recent Changes

- testing

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

