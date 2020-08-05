(async () => {
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

    const https = require('https')

    const https_request = ({ body, ...options }) =>
        new Promise((resolve, reject) => {
            const req = https.request({ ...options },
                res => {
                    const chunks = []
                    res.on('data', data => chunks.push(data))
                    res.on('end', () => {
                        const res_body = Buffer.concat(chunks)
                        const content_type = res.headers['content-type'] || ''
                        if (content_type.startsWith('application/json')) {
                            const json_body = JSON.parse(res_body)
                            resolve(json_body)
                        }
                        else resolve(body)
                    })
                })
            req.on('error', reject)
            if (body) {
                req.write(body)
            }
            req.end()
        })


    const res = await https_request({
        method: 'POST',
        hostname: 'api.github.com',
        path: `/repos/${process.env.GITHUB_REPOSITORY}/statuses/${process.env.GITHUB_SHA}`,
        headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'CI-Workflow'
        },
        body: JSON.stringify({
            state: "success",
            description: "aok",
            context: "Github-CI-Workflow/vanilla-post.js",
            target_url: `https://github.com/${process.env.GITHUB_REPOSITORY}/actions?query=ci`
        })
    })

    console.log(`Commit ${process.env.GITHUB_SHA} updated: ${res.url}`)

})()



