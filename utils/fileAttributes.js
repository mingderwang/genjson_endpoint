const path = require('path');
const fse = require('fs-extra');
const fs = require('fs');

function excludedfile(filePath) {
	const excludes = [ '.iso', '.mp3', '.mp4', '.mpg', '.m4a', '.mov', '.qt', '.wav', '.tif', '.aif', '.aiff', 'aifc', '.au', '.aac', '.adt', '.adts', '.bin', '.dll', '.rar', '.vob', '.wmd', '.wmv', '.wma', '.flv', '.bmp', '.cda', '.tar', '.zip', '.ra', '.avi', '.exe', '.jpg', '.msi', '.png', '.jpeg', '.gif', '.tz']
	let ext = path.extname(filePath.toLowerCase())
	console.log("exclude file base64:",ext)
	return excludes.includes(ext)
}

const fileInfo = (filename) => {
    var stats = {};
    try {
	    console.log("fileInfo:",filename)
	    let noParseFile = excludedfile(filename)
  stats = fse.statSync(filename);
	    console.log("fileInfo:stats",stats)
let isDirExists = fs.lstatSync(filename).isDirectory()
        var fileBase64;
        var is_folder = false
  console.log("Dir exists.",isDirExists);
        if (isDirExists || noParseFile) {
		console.log("no fileBase64")
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
  stats['data'] = ""
  stats['file_path'] = filename
        stats['is_folder'] = is_folder
        return stats
}
}

module.exports = fileInfo
