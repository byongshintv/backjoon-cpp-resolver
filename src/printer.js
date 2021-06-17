
const chalk = require('chalk')
const print = console.log;
const printer = {
    clear : console.clear,
    testcase:{
        title:(label,isOK,time) => {
            print(` - ${label} : ${isOK ? chalk.green("OK") : chalk.red("NG")}(${time}ms)`)
        },
        expected:(expected,result) => {
            print(`\t- 예측 :${expected}`)
            print(`\t- 결과 :${result}`)
        }
    },
    compile:{
        loading:(filename) =>{
            print(`${filename} 컴파일 중...`)
        },
        complete:(isok) => {
            if(isok) print(chalk.green` 컴파일 성공.\n`)
                else print(chalk.red`컴파일 에러`)
            
            
        }
    },
    problem:{
        loaded:(isOk) => {
            const str = `\n\t${chalk.magenta('▷  문제를 성공적으로 불러왔습니다.')} \t${chalk.gray('문제확인 : question.md 우클릭 -> 미리보기 열기')}\n `
            print(str)
        } ,
        setTitle:function(title, no){
            this.meta = {title,no}
        },
        title:function(){
            const {title,no} = this.meta
            const str = `\t${chalk.bold(`문제 : ${title}`)} (${no}번)\n\n`
            print(str)
        }
    }
}

module.exports = printer