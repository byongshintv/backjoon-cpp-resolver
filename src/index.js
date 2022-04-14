const fs = require("fs")
const path = require('path')
const { watch, execIO, destroySpawn} = require('./io')
const { getProblemData } = require('./request')
const Printer = require('./printer')
const { StringUtil, asleep } = require('./util')
const  { filePath, setting } = require('./constant')
const { compile } = require("./compile")


function isExistPath(rootPath,str){
    return !str.match(/\n/) && fs.existsSync(path.resolve(rootPath,str))
}

async function test(){
    const { testcase:additionalCase, executeOperator,timeout } = setting.get()

    let testCases = JSON.parse(fs.readFileSync(filePath.case, 'utf-8'));
    testCases = testCases.map((v, i) => [...v, `test case ${i + 1}`])

    testCases = [].concat(testCases, additionalCase.map((v, i) => [...v, `user case ${i + 1}`]))

    for (let [testInput, testOutput, label] of testCases) {

        
        if(isExistPath(filePath.main,testInput)){ // testinput이 경로일때
            testInput = fs.readFileSync(path.resolve(filePath.main,testInput),'utf-8')
        }

        if(isExistPath(filePath.main,testOutput)){ // testoutput이 경로일때 경로의 내용 가져옴
            testOutput = fs.readFileSync(path.resolve(filePath.main,testOutput),'utf-8')
        }
        
        try{
            setTimeout(destroySpawn,timeout )
            var [result, time] = (await execIO(testInput,executeOperator))
        } catch(e) {
            Printer.err.runtime()
            console.log(e)
            break;
        }
        result = StringUtil.removeLastSpace(result);
        testOutput = StringUtil.removeLastSpace(testOutput);

        const isOK = result == testOutput
        Printer.testcase.title(label, isOK, time)

        const { escapeNewLine } = setting.get()
        if (!isOK){
            const formatter = escapeNewLine ? (v) => v.replace(/\n/g,"\n\t\t") :  StringUtil.escapeNewline; 
            Printer.testcase.expected(
                formatter(testInput),
                formatter(testOutput),
                formatter(result)
            )
        }
    }
}

async function execAndPrint(){
    const { testcase, executeOperator } = setting.get()

    let [result, time] = (await execIO(testcase?.[0]?.[0] || "",executeOperator))
    console.log(result);
}


async function main() {
    async function triggeredSource(isClear = true) {
        destroySpawn();
        const {printOnly: isPrintOnly, canCompile, executeFileName, hideInfomation} = setting.get()

        if(canCompile){
            const compileResult = await compile(true);
            if(!compileResult) return
        } else {
            Printer.clear()
            Printer.problem.title(hideInfomation)
        }

        if( isPrintOnly ) return execAndPrint();
        await test();
        if (canCompile) {
            destroySpawn()
            await asleep(50)
            let unlinkPath = path.join(__dirname, '..', 'main', executeFileName);
            if(fs.existsSync(unlinkPath)) fs.unlinkSync(unlinkPath);
        }
    }
    
    fs.readdirSync("./main").filter(v => v.match(/main\.*/i) && !v.match(/exe$/)).forEach(filename => {
        watch.file(path.join('main',filename), () => triggeredSource())
    })

    watch.file(filePath.setting, async function () {
        const no = setting.get("problemNo");
        const { descript, cases, title } = await getProblemData(no);
        const questionPath = setting.get("question")
        fs.writeFileSync(questionPath, descript, "utf-8");
        fs.writeFileSync(filePath.case, JSON.stringify(cases), "utf-8");

        Printer.clear();
        Printer.problem.loaded(true)
        Printer.problem.setTitle(title, no)
        Printer.problem.title()

        triggeredSource(false);
    }).trigger()
 
}

main();