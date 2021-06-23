
function main(args){
    args = args.split(" ")
    return args[0]*1 + args[1]*1
}

const readline = require('readline');         

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

let input = [];

rl.on('line', function (line) {
input.push(line)
})
.on('close', function () {
console.log(main(input.join("\n")));
process.exit();
});