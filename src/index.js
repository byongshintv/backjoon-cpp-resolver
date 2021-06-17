const fs = require("fs")
const path = require("path")
const exec = require('child_process').execFile;
const { getLiveJSON,watch } = require('./io')
const { getProblemData } = require('./request')
const { Readable } = require("stream")
const printer = require('./printer')
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

    async function triggeredSource(isClear = true) {
        const additionalCase = setting.get("testcase")

        if(isClear) printer.compile.loading(setting.get("input"), isClear )
        const compileResult = await execAsync(
            setting.get("compilerPath"), 
            ['-o', setting.get("output"), setting.get("input")]
        )

        if (compileResult[0]) return printer.compile.complete(false)
        if(isClear){
            printer.clear()
            printer.problem.title()    
        }
        printer.compile.complete(true)

        let testCases = JSON.parse(fs.readFileSync(filePath.case, 'utf-8'));
        testCases = testCases.map((v, i) => [...v, `test case ${i + 1}`])

        testCases = [].concat(testCases, additionalCase.map((v, i) => [...v, `user case ${i + 1}`]))
        for (let [testInput, testOutput, label] of testCases) {
            let [result, time] = await execMain(testInput);
            result = result?.replace(/\s+$/,""); 
            testOutput = testOutput?.replace(/\s+$/,"");  

            const isOK = result == testOutput
            printer.testcase.title(label, isOK, time)
            
            if (!isOK)
                printer.testcase.expected(
                    testOutput.replace(/\n/g," \\n "), 
                    result.replace(/\n/g," \\n ")
                )


        }
    }

    watch.file(setting.get("input"), () => triggeredSource())

    watch.json(filePath.setting, 'problemNo', async function (no) {
        const { descript, cases, title } = await getProblemData(no);
        fs.writeFileSync(filePath.question, descript, "utf-8");
        fs.writeFileSync(filePath.case, JSON.stringify(cases), "utf-8");
        printer.clear();
        
        printer.problem.loaded("success")
        printer.problem.setTitle(title,no)
        printer.problem.title()

        triggeredSource(false);
    }).trigger();

}

main();