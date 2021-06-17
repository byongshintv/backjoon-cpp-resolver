async function asleep(interval, rInterval = 0){
	return new Promise(async function(res,rej){
		var addInterval = Math.random() * rInterval - (rInterval/2)
		setTimeout(function(){
			res()
		}, interval + addInterval)
	})

}

module.exports = { asleep }