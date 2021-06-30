async function asleep(interval, rInterval = 0) {
	return new Promise(async function (res, rej) {
		var addInterval = Math.random() * rInterval - (rInterval / 2)
		setTimeout(function () {
			res()
		}, interval + addInterval)
	})
}

const StringUtil = {
	removeLastSpace: (str) => str.replace(/\s+$/, ""),
	escapeNewline: (str) => str.replace(/\n/g, " \\n ").replace(/\n\s+\n/g, "\\n")
}
module.exports = { asleep,StringUtil }