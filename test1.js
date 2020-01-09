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

const ps = new Shell({
  executionPolicy: 'Bypass',
  noProfile: true
});

ps.addCommand("./test.ps1", [
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
