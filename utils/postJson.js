const request = require('request');
const fileInfo = require('./fileAttributes');

async function postJson(filename) {
    console.log("------- filename, is:", filename)
    var stats = fileInfo(filename.fullPath)
    console.log("------- fileInfo, return size:", stats.size)

    if (stats == null) {
       console.log("------- directory, return")
    }
var options = {
    url: 'https://10.99.1.10:9200/win_index/_doc/?pipeline=attachment',
    method: 'POST',
    body: stats,
    json: true,
    auth: {
      user: 'admin',
      pass: 'admin',
      sendImmediately: false
    }
};

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
// run your async function
console.log('should first print')
await myBackEndLogic(options);
console.log('should late print')
}
// now to program the "usual" way
// all you need to do is use async functions and await
// for functions returning promises
async function myBackEndLogic(options) {
    try {
        console.log('SHOULD start')
        const html = await downloadPage(options)
        console.log('SHOULD end:');
        console.log(html)
    } catch (error) {
        console.error('ERROR:');
        console.error(error);
    }
}
// wrap a request in an promise
function downloadPage(options) {
    return new Promise((resolve, reject) => {
request(options, (error, response, body) => {
            if (error) reject(error);
    /*
            if (response.statusCode != 201) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
    */
            resolve(body);
        }
)
})
}

module.exports = postJson
