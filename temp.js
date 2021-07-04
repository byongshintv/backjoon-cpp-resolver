const {spawn, exec} = require("child_process")
const dir2 = spawn('cmd', ['/c', 'dir'])
dir2.stdout.on('data', function(data) {
  console.log('stdout: ' + data);
});

dir2.stderr.on('data', function(data) {
  console.log('stderr: ' + data);
});

dir2.on('exit', function(code) {
  console.log('exit: ' + code);
});

var child = exec('dir', function(err, stdout, stderr) {
  if (err) throw err;
  console.log(stdout)
});