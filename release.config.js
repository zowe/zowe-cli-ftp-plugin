module.exports = {
    branches: [
        {
            name: "master",
            level: "minor",
            devDependencies: ["@zowe/cli", "@zowe/imperative", "@zowe/cli-test-utils"]
        },
        {
            name: "zowe-v1-lts",
            level: "patch",
            devDependencies: ["@zowe/cli", "@zowe/imperative", "@zowe/cli-test-utils"]
        }
        // {
        //     name: "next",
        //     prerelease: true,
        //     devDependencies: ["@zowe/cli", "@zowe/imperative", "@zowe/cli-test-utils"]
        // }
    ],
    plugins: [
        "@octorelease/changelog",
        ["@octorelease/npm", {
            npmPublish: false,
            tarballDir: "dist",
            aliasTags: {
                latest: ["zowe-v2-lts", "next"]
            },
            pruneShinkwrap: true
        }],
        ["@octorelease/github", {
            checkPrLabels: true,
            assets: "dist/*.tgz"
        }],
        "@octorelease/git"
    ]
};
