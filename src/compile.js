const { execAsync } = require('./io');
const Printer = require('./Printer');
const { setting, filePath } = require('./constant');


async function getCompilerPath(){
    let {compilerPath, compilerName} = setting.get() 
    const checkVersionArgs = ["--version"]
    const errmsg = {
        notDefined: "컴파일러가 기술되지 않은 언어에 컴파일을 시도했습니다.",
        notFoundAllCompiler: `컴파일러를 찾을 수 없습니다. \n\t "${compilerName}"가 위치한 폴더를 환경변수로 정의 해 주시거나, ${filePath.setting}에 컴파일러의 경로를 기술 해 주세요.`,
        notFoundDefineCompiler: `${compilerPath}가 올바르지 않은 컴파일러이므로 기존 ${compilerName}을 사용해 컴파일합니다.`
    }

    if(!compilerName) throw Error(errmsg.notDefined)

    if( compilerPath === undefined){
        //경우1 컴파일러 경로가 기술되지 않은 경우
        let [compilerNotFound] = await execAsync(compilerName,checkVersionArgs)
        if(compilerNotFound) throw Error(errmsg.notFoundAllCompiler) //기본 컴파일러가 없을 경우 예외 반환
        else compilerPath = compilerName
    } else {
        //경우2 컴파일러 경로가 기술된 경우
        let [compilerNotFound] = await execAsync(compilerPath,checkVersionArgs)
        if(compilerNotFound){
            let [defaultCompilerNotFound] = await execAsync(compilerName,checkVersionArgs) 
            if(defaultCompilerNotFound){
                throw Error(errmsg.notFoundAllCompiler)//적힌 컴파일러 기본 컴파일러 둘 다 없을 경우 예외 반환
            }
            console.log(errmsg.notFoundDefineCompiler)
            compilerPath = compilerName
        }
    }

    return compilerPath
}

async function compile(isClear) {
    const compilerPath = await getCompilerPath();
    let compilerArgument = setting.get("compilerArgument") 

    if (isClear) Printer.compile.loading(setting.get("input"), isClear);

    const compileResult = await execAsync(compilerPath, compilerArgument);

    if (compileResult[0]) {
        Printer.compile.complete(false);
        return false;
    }

    if (isClear) {
        Printer.clear();
        Printer.problem.title();
    }

    Printer.compile.complete(true);
    return true;
}

exports.compile = compile;
