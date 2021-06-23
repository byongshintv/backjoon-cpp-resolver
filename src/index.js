const fs = require("fs")
const path = require("path")
const { getLiveJSON, watch, execIO, execAsync } = require('./io')
const { getProblemData } = require('./request')
const Printer = require('./Printer')
const { StringUtil } = require('./util')


const filePath = {
    setting: path.resolve(__dirname, '../setting.json'),
    question: path.resolve(__dirname, '../question.md'),
    case: path.resolve(__dirname, './temp/testcase.json'),
}

const setting = getLiveJSON(filePath.setting, {
    input: "main.cpp",
    output: "main",
    lang: "cpp"
})


async function compile(isClear){

    if (isClear) Printer.compile.loading(setting.get("input"), isClear)
    const compileResult = await execAsync(
        setting.get("compilerPath"),
        ['-o', setting.get("output"), setting.get("input")]
    )

    if (compileResult[0]) {
        Printer.compile.complete(false)
        return false;
    }
    if (isClear) {
        Printer.clear()
        Printer.problem.title()
    }
    Printer.compile.complete(true)
    return true;
}

async function test(){
    const additionalCase = setting.get("testcase")
    let testCases = JSON.parse(fs.readFileSync(filePath.case, 'utf-8'));
    testCases = testCases.map((v, i) => [...v, `test case ${i + 1}`])

    testCases = [].concat(testCases, additionalCase.map((v, i) => [...v, `user case ${i + 1}`]))

    for (let [testInput, testOutput, label] of testCases) {
        let [result, time] = await execIO(testInput,`./${setting.get("output")}.exe`);
        result = StringUtil.removeLastSpace(result);
        testOutput = StringUtil.removeLastSpace(testOutput);

        const isOK = result == testOutput
        Printer.testcase.title(label, isOK, time)

        if (!isOK)
            Printer.testcase.expected(
                StringUtil.escapeNewline(testOutput),
                StringUtil.escapeNewline(result)
            )
    }
}

async function execAndPrint(){
    let testCases = JSON.parse(fs.readFileSync(filePath.case, 'utf-8'));

    let [result, time] = await execIO(testCases[0][0],`./${setting.get("output")}.exe`);
    console.log(result);
}


async function main() {
    async function triggeredSource(isClear = true) {
        const compileResult = await compile(true);
        if(!compileResult) return
        if(setting.get("printOnly")) return execAndPrint();
        await test();
    }

    watch.file(setting.get("input"), () => triggeredSource())

    watch.json(filePath.setting, 'problemNo', async function (no) {
        const { descript, cases, title } = await getProblemData(no);
        fs.writeFileSync(filePath.question, descript, "utf-8");
        fs.writeFileSync(filePath.case, JSON.stringify(cases), "utf-8");

        Printer.clear();
        Printer.problem.loaded(true)
        Printer.problem.setTitle(title, no)
        Printer.problem.title()

        triggeredSource(false);
    }).trigger();

}

main();