
const { getLiveJSON } = require('./io')
const path = require("path")

const filePath = {
    setting: path.resolve(__dirname, '../main/setting.yml'),
    case: path.resolve(__dirname, './temp/testcase.json'),
}

const languageMeta = [
    { 
        name:"c++",
        compile : ({output, input}) => (['-o', output, input]),
        match : ({input}) => input.match(/\.cpp$/)
    },
    { 
        name:"nodejs",
        execute : ({input}) => ['node',input],
        match : ({input}) => input.match(/\.js$/)
    },
    {
        name:"default",
        execute : ({output}) => `./${output}.exe`,
        match : () => true
    }
]

const setting = getLiveJSON(filePath.setting, {
    input: "main.cpp",
    output: "main",
    lang: "cpp"
},(setting) => {
    const langSetting = languageMeta.filter(v => v.match(setting))[0];
    const defaultSetting = languageMeta.filter(v => v.name === "default")[0];
    return {
        languageName:langSetting.name,
        canCompile:langSetting.compile !== undefined,
        compilerArgument:langSetting.compile?.(setting),
        executeOperator:( langSetting.execute || defaultSetting.execute )?.(setting)
    }
})

module.exports = { filePath, languageMeta, setting }

