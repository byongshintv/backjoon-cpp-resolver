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
    const raw = await fetch(url,{
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", 
            "Accept-Encoding": "gzip, deflate, br", 
            "Accept-Language": "ko-KR,ko;q=0.9", 
            "Connection": "keep-alive", 
            "Host": "www.acmicpc.net", 
            "sec-ch-ua": `" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"`, 
            "sec-ch-ua-mobile": "?0", 
            "sec-ch-ua-platform": "Windows", 
            "Sec-Fetch-Dest": "document", 
            "Sec-Fetch-Mode": "navigate", 
            "Sec-Fetch-Site": "none", 
            "Sec-Fetch-User": "?1", 
            "Upgrade-Insecure-Requests": "1", 
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36", 
        },
        redirect: 'follow',
    }).then(res => res.text())
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