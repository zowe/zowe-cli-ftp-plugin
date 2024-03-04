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
            devDependencies: ["@zowe/cli", "@zowe/imperative"]
        },
        {
            name: "next",
            prerelease: true,
            level: "none",
            devDependencies: ["@zowe/cli", "@zowe/imperative", "@zowe/cli-test-utils"]
        }
    ],
    plugins: [
        "@octorelease/changelog",
        ["@octorelease/npm", {
            aliasTags: {
                latest: ["zowe-v2-lts"]
            },
            pruneShrinkwrap: true
        }],
        ["@octorelease/github", {
            checkPrLabels: true
        }],
        "@octorelease/git"
    ]
};
