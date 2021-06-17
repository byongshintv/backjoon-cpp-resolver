const fs = require("fs")
const path = require("path")
const exec = require('child_process').execFile;
const { getLiveJSON,watch } = require('./io')
const { getProblemData } = require('./request')
const { Readable } = require("stream")
const chalk = require('chalk')

//비동기로 실행되는 exec 함수, 사용법은 기존 콜백 대신 .then()혹은 await으로 리턴값 받기
const execAsync = (...args) => {
    return new Promise((res) => {
        args.push((...callbackArgs) => {
            res(callbackArgs)
        })
        exec(...args)
    })
}

const filePath = {
    setting: path.resolve(__dirname, '../setting.json'),
    question: path.resolve(__dirname, '../question.md'),
    case: path.resolve(__dirname, './testcase.json'),
}

const setting = getLiveJSON(filePath.setting,{
    input : "main.cpp",
    output : "main"
})

//const setting = ('./io').initLiveJSON
async function main() {

    /**
     * 컴파일된 exe파일을 실행, 출력값은 비동기로 반환
     * @param {*} input exe파일의 입력값
     */
    function execMain(input) {
        return new Promise((res, rej) => {
            const start = Date.now();
            const child = exec(`./${setting.get("output")}.exe`, function (err, stdout, stderr) {
                if (err) rej(err)
                if (stderr) rej(err)
                res([stdout, Date.now() - start])
            })
            const readable = Readable.from(input.split("\n"))
            readable.pipe(child.stdin)
        })
    }

    // 두번째 이후 컴파일부터 출력되는 스타일링된 문제 제목 및 번호
    let header = ''

    async function triggeredSource(isClear = true) {
        const additionalCase = setting.get("testcase")

        if (isClear) {
            console.clear()
            console.log(setting.get("input") + " 컴파일 중...")
        }
        const compileResult = await execAsync(
            setting.get("compilerPath"), 
            ['-o', setting.get("output"), setting.get("input")]
        )

        if (compileResult[0]) return console.log(chalk.red`컴파일 에러`)
        if (isClear) {
            console.clear()
            console.log(header)
        }
        console.log(chalk.green` 컴파일 성공.\n`)

        let testCases = JSON.parse(fs.readFileSync(filePath.case, 'utf-8'));
        testCases = testCases.map((v, i) => [...v, `test case ${i + 1}`])

        testCases = [].concat(testCases, additionalCase.map((v, i) => [...v, `user case ${i + 1}`]))
        for (let [testInput, testOutput, label] of testCases) {
            let [result, time] = await execMain(testInput);
            result = result?.replace(/\s+$/,""); 
            testOutput = testOutput?.replace(/\s+$/,"");             
            const isOK = result == testOutput
            console.log(` - ${label} : ${isOK ? chalk.green("OK") : chalk.red("NG")}(${time}ms)`)
            if (!isOK) {
                console.log(`\t- 예측 :${testOutput.replace(/\n/g," \\n ")}`)
                console.log(`\t- 결과 :${result.replace(/\n/g," \\n ")}`)
            }

        }
    }

    watch.file(setting.get("input"), () => triggeredSource())

    watch.json(filePath.setting, 'problemNo', async function (no) {
        const { descript, cases, title } = await getProblemData(no);
        fs.writeFileSync(filePath.question, descript, "utf-8");
        fs.writeFileSync(filePath.case, JSON.stringify(cases), "utf-8");
        console.clear();
        let loadedMsg = `\n\t${chalk.magenta('▷  문제를 성공적으로 불러왔습니다.')} \t${chalk.gray('문제확인 : question.md 우클릭 -> 미리보기 열기')}\n `
        loadedMsg =
            console.log(loadedMsg)
        header = `\t${chalk.bold(`문제 : ${title}`)} (${no}번)\n\n`
        console.log(header)
        header = "\n" + header

        triggeredSource(false);
    }).trigger();

}

main();