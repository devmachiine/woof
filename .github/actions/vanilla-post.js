// woof
// https://api.github.com/repos/devmachiine/woof/commits/master/status

//   curl \
//   -X POST \
//   -H "Accept: application/vnd.github.v3+json" \
//   -H "Authorization: token $GITHUB_TOKEN" \
//   https://api.github.com/repos/$GITHUB_REPOSITORY/statuses/$GITHUB_SHA \
//   -d '{"state":"success", "description":"okay from curl"}'

console.log(`env: repository ${process.env.GITHUB_REPOSITORY} `)
console.log(`env: token ${process.env.GITHUB_TOKEN} `)
console.log(`env: sha ${process.env.GITHUB_SHA} `)

// El copy pastrami
// https://stackoverflow.com/a/50891354/11193943

const https = require('https');

function httpsPost({ body, ...options }) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            method: 'POST',
            ...options,
        }, res => {
            const chunks = [];
            res.on('data', data => chunks.push(data))
            res.on('end', () => {
                let body = Buffer.concat(chunks);
                switch (res.headers['content-type']) {
                    case 'application/json':
                        body = JSON.parse(body);
                        break;
                }
                resolve(body)
            })
        })
        req.on('error', reject);
        if (body) {
            req.write(body);
        }
        req.end();
    })
}

(async () => {
    const res = await httpsPost({
        hostname: 'api.github.com',
        path: `/repos/${process.env.GITHUB_REPOSITORY}/statuses/${process.env.GITHUB_SHA}`,
        headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'CI-Workflow'
        },
        body: JSON.stringify({
            state: "success",
            description: "vanilla update",
            context: "github action: post-commit-status.js",
            target_url: `https://github.com/${process.env.GITHUB_REPOSITORY}/actions?query=ci`
        })
    })
    console.log(`Response:\n${res}`)
})()



