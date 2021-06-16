const fs = require("fs")
const path = require("path")
const exec = require('child_process').execFile;
const { watch } = require('./util')
const { getProblemData } = require('./request')
const testCase = [['','Hello World']]

async function main(){
    const { 
        input = "main.cpp",
        output = "main",
        compilerPath } = JSON.parse( await fs.readFileSync("setting.json") )

    async function triggeredSource(isClear = true){
            if(isClear){
                console.clear()
                console.log(input+" 컴파일 중...")
            }
            await exec(compilerPath,['-o',output,input])
            if(isClear) console.clear()
            console.log(input+" 컴파일 완료.")
            exec(`main`, function(err,data){
                if(err && err.errno === -4058){
                    console.log("컴파일 에러")
                }
            })
    }

    watch.file(input,triggeredSource)

    const filePath = {
        setting : path.resolve(__dirname,'../setting.json'),
        question : path.resolve(__dirname,'../question.md'),
        case : path.resolve(__dirname,'./testcase.json'),
    }

    watch.json(filePath.setting,'problemNo',async function(no){
        const {descript,cases,title} = await getProblemData(no);
        fs.writeFileSync(filePath.question,descript,"utf-8");
        fs.writeFileSync(filePath.case,JSON.stringify(cases),"utf-8");
        console.clear();
        console.log(`문제 로딩 완료 : ${title}(${no})`)
        console.log(`문제는 question.md파일에 있습니다.`)
        triggeredSource(false);
    }).trigger();
    


}

main();