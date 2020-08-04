const { Octokit } = require("@octokit/action");

const octokit = new Octokit();
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

const sha = process.env.GITHUB_SHA

    (async () => {
        // See https://docs.github.com/en/rest/reference/repos#create-a-commit-status
        const { data } = await octokit.request("POST /repos/:owner/:repo/statuses/:sha", {
            owner,
            repo,
            sha,
            state: "success",
            description: "all good",
            context: "github action: post-commit-status.js"
        });

        console.log(`Commit ${sha} updated: ${data.html_url}`)
    })()


