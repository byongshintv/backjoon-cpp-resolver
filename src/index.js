const fs = require("fs")
const path = require("path")
const { getLiveJSON, watch, execIO, execAsync } = require('./io')
const { getProblemData } = require('./request')
const Printer = require('./Printer')
const { StringUtil } = require('./util')


const filePath = {
    setting: path.resolve(__dirname, '../setting.json'),
    question: path.resolve(__dirname, '../question.md'),
    case: path.resolve(__dirname, './testcase.json'),
}

const setting = getLiveJSON(filePath.setting, {
    input: "main.cpp",
    output: "main"
})

async function main() {
    async function triggeredSource(isClear = true) {
        const additionalCase = setting.get("testcase")

        if (isClear) Printer.compile.loading(setting.get("input"), isClear)
        const compileResult = await execAsync(
            setting.get("compilerPath"),
            ['-o', setting.get("output"), setting.get("input")]
        )

        if (compileResult[0]) return Printer.compile.complete(false)
        if (isClear) {
            Printer.clear()
            Printer.problem.title()
        }
        Printer.compile.complete(true)

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