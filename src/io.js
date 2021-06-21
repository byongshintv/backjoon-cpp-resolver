const { asleep } = require('./util')
const fs = require("fs")
const {execFile:exec, spawn} = require('child_process');
const { Readable } = require("stream")

const watch = {
    file: (target, callback) => {
        let lastCompile = Date.now()
        const threshold = 100
        fs.watch(target, async function () {
            if (Date.now() - lastCompile < threshold) return
            lastCompile = Date.now()

            callback(fs.readFileSync(target, "utf-8"));
        })
    },
    json: (target, watchKey, callback) => {
        let value = ''
        async function execute() {
            await asleep(10)
            const raw = fs.readFileSync(target, "utf-8");

            const json = JSON.parse(raw)
            if (value !== json[watchKey]) {
                value = json[watchKey]
                callback(value)
            }
        }
        watch.file(target, execute)
        return { trigger: () => execute() }
    }
}

function getLiveJSON(fileName = "setting.json", defaultValue = {}) {
    return {
        get: function (property) {
            try {
                const json = JSON.parse(fs.readFileSync(fileName))
                return json[property] || defaultValue[property]
            } catch {
                console.log(filename + "에 이상이 있습니다. 확인 해 주세요")
            }
        }
    }
}


/**
 * 컴파일된 exe파일을 실행, 출력값은 비동기로 반환
 * @param {*} input exe파일의 입력값
 */
function execIO(input, filename) {
    return new Promise((res, rej) => {
        const start = Date.now();
        const child = spawn(filename)
                
        child.stdin.write(input)
        child.stdout.on('data',(data) => {
            res([data.toString().replace(/\r\n/g,"\n"), Date.now() - start])

        });
        child.stdin.end();


        /*
        const readable = Readable.from(input.split("\n"))
        readable.pipe(child.stdin)
        */
    })
}

//비동기로 실행되는 exec 함수, 사용법은 기존 콜백 대신 .then()혹은 await으로 리턴값 받기
const execAsync = (...args) => {
    return new Promise((res) => {
        args.push((...callbackArgs) => {
            res(callbackArgs)
        })
        exec(...args)
    })
}


module.exports = { watch, getLiveJSON, execIO, execAsync }
