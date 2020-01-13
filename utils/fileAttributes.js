const fse = require('fs-extra');
const fs = require('fs');

const fileInfo = (filename) => {
    var stats = {};
    try {
	    console.log("fileInfo:",filename)
  stats = fse.statSync(filename);
	    console.log("fileInfo:stats",stats)
let isDirExists = fs.lstatSync(filename).isDirectory()
        var fileBase64;
        var is_folder = false
  console.log("Dir exists.",isDirExists);
        if (isDirExists) {
            fileBase64 = ""
            is_folder = true
        } else {
    const fileContents = fse.readFileSync(filename);
    fileBase64 = fileContents.toString('base64');
        }
  stats['data'] = fileBase64
  stats['file_path'] = filename
        stats['is_folder'] = is_folder
        return stats
}
catch (e) {
  console.log("File does not exist.-----with error: ",e);
        return null
}
}

module.exports = fileInfo
