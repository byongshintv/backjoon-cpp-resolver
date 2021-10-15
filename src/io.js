const { asleep } = require('./util')
const fs = require("fs")
const path = require('path')
const spawn = require('cross-spawn');
const {execFile} = require('child_process');
const YAML = require("yaml");

const watch = {
    file: (target, callback) => {
        let lastCompile = Date.now()
        const threshold = 100
        async function execute() {
            if (Date.now() - lastCompile < threshold) return
            lastCompile = Date.now()
            await asleep(100);

            callback(fs.readFileSync(target, "utf-8"));
        }

        fs.watch(target, execute)

        return { trigger: async (...args) => {
            
            await asleep(150);
            execute(...args)
        } }
    },
    json: (target, watchKey, callback) => {
        let value = ''
        async function execute() {
            await asleep(10);
            let json = parseJSONFile(target);
            if (value !== json[watchKey]) {
                value = json[watchKey]
                callback(value)
            }
        }
        watch.file(target, execute)
        return { trigger: () => {}}
    }
}

function getLiveJSON(fileName = "setting.json", defaultValue = {}, flowSetting = () => ({})) {
    return {
        get: function (property) {
                let json = parseJSONFile(fileName);
                let setting = {
                    ...defaultValue,
                    ...json,
                }
                setting = {
                    ...setting,
                    ...flowSetting(setting)
                }

                return property === undefined ? setting : setting[property];
        }
    }
}

/**
 * *.json, *.yml과 같은 파일 파싱해서 읽어오는 함수
 * @param {String} path json/yml파일의 경로 
 */
function parseJSONFile(path){
    const raw = fs.readFileSync(path,"utf-8");
    let json
    if( path.match(/\.json$/) ){
        json = JSON.parse(raw);
    } else if ( path.match(/\.yml$/) ){
        json = YAML.parse(raw);
    } else throw Error("올바르지 않은 JSON 파일입니다.")
    return json
}






/**
 * 컴파일된 exe파일을 실행, 출력값은 비동기로 반환
 * @param {*} input exe파일의 입력값
 */
 let child
function execIO(input, operation) {
    return new Promise((res, rej) => {
        if(child) child.stdin.destroy();
        option = {cwd: path.join(__dirname, '..', 'main')}

        if(typeof operation === "string") { child = spawn(operation, option)}
        else if(typeof operation === "object" && operation.length === 1 ) { child = spawn(operation[0], [], option)}
        else if(typeof operation === "object" && operation.length > 1 ) { child = spawn(operation[0], operation.slice(1), option)}
        else { throw new Error("알 수 없는 operation 형식입니다.") }
        
        let result = ""
        let errs = []
        let start = Date.now();
        child.stdin.write(input)
        child.stdout.on('data',(data) => {
            result += data.toString().replace(/\r\n/g,"\n")
        });
        child.stdout.on('end',(data) => {
            if(errs.length === 0) return res([result,Date.now() - start])
            rej(result + "\n" + errs.join("\n"))
        });

        child.stderr.on('data', function(data) {
            errs.push(data.toString())
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
        execFile(...args)
    })
}

module.exports = { watch, getLiveJSON, execIO, execAsync, parseJSONFile }
