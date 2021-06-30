

/*
function solve(str, result = 0){
    if(str.length === 0) return result
    return solve(str.substring(1), (result * 10 + str) %  20000303 )
}

function main(args) {
    return solve(args)
}

require('readline')

.createInterface({
    input: process.stdin,
    output: process.stdout
})

.on('line', function (line) {
    console.log(main(line))
})

.on('close', function () {
    process.exit();
});
Array.range = function(n) {
    return new Array(n).fill(true).map((x,i) => i+1)
};

String.prototype.splitInt = function(){
    return this.split(" ").map(v => v*1);
}
Array.prototype.spliceOne = function(filter){
    for(var i =0; i < this.length; i++){
        if( filter(this[i],i) )
            return this.splice(i,1);
    }
}

String.prototype.splitInt = function(){
    return this.split(" ").map(v => v*1);
}
  
Array.prototype.chunk = function(n) {
      return Array.range(Math.ceil(this.length/n)).map((x,i) => this.slice(i*n,i*n+n));  
}
    

Array.prototype.count = function(toEntry,issort){
    let result = {}
    for( var i = 0; i < this.length; i++){
        var label = this[i][0]
        result[label] = (result[label] || 0) + 1  
    }
    if(toEntry) result = Object.entries(result);
    if(issort) result = result.sort((a,b) => a[0].localeCompare(b[0]))
     
    return result
}
String.prototype.count = function (v) {
    return (this.length - this.replace(new RegExp(v, "g"), "").length) / v.length
}
 
String.prototype.testCase = function(){
    var result = this.split("\n");
    result.shift();
    return result;
}


Array.prototype.markOne = function(filter,callback){
    for(var i =0; i < this.length; i++){
        if( filter(this[i],i) )
            return this[i] = callback(this[i],i)
    }
}


/*
*/