const iconv = require('iconv-lite');
const Shell = require('node-powershell');
if (process.argv.length <= 2) {
  console.log(
    "Usage: node " +
      __filename +
      ' "c:\\Users\\ttt\\ming\\src" https://<ELK ip>:9200'
  );
  process.exit(-1);
}
var root_path = process.argv[2];
console.log(root_path)
let       buf = iconv.encode(root_path, 'win1251');
          let utf8_file_path = iconv.decode(Buffer.from(buf), 'utf8');

console.log(utf8_file_path)

const ps = new Shell({
  executionPolicy: 'Bypass',
  noProfile: true
});

ps.addCommand("./getFileAcl.ps1", [
  {
    name: "filePath",
    value: root_path
  }
]);
ps.invoke()
.then(output => {
  console.log(output);
})
.catch(err => {
  console.log(err);
});
