const { default: fetch } = require("node-fetch");
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

Array.range = function(n) {
    return [...new Array(n)].map((x,i) => i)
};

Array.prototype.chunk = function(n=2) {
    return Array.range(Math.ceil(this.length/n)).map((x,i) => this.slice(i*n,i*n+n));
}

async function getProblemData(no = 1010){
    const url = 'https://www.acmicpc.net/problem/' + no
    const raw = await fetch(url).then(res => res.text())
    const $raw = $(raw)
    $raw.find("img").attr("src",(i,v) => v.match(/^\//)? "https://www.acmicpc.net" +v : v)

    const descript = $raw.find("#description, #input, #output").toArray().map(v => $(v).html().replace(/\t/g,"")).join("\n")
    const cases = $raw.find(".sampledata").toArray().map(v => $(v).text().replace(/\n$/,""))
        .chunk(2)
    const title = $raw.find("#problem_title").text();
    return {
        descript,cases,title
    }
}

module.exports = { getProblemData }