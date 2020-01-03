const getFilePaths = require('./utils/getFilePaths')

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to");
    process.exit(-1);
}
var root_path = process.argv[2];

var result = getFilePaths(root_path);

