var crypto = require('crypto');
var name = '/Users/mingderwang/src/panasonic/genjson_endpoint';
var hash = crypto.createHash('md5').update(name).digest('hex');
console.log(hash); // 9b74c9897bac770ffc029102a200c5de
