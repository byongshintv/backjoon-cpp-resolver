
const { getLiveJSON } = require('./io')
const path = require("path")

const filePath = {
    setting: path.resolve(__dirname, '../main/setting.yml'),
    case: path.resolve(__dirname, './temp/testcase.json'),
}

const languageMeta = [
    { 
        name:"c",
        compile : ({output, input}) => (['-o', path.join('main', 'main'), path.join('main', input)]),
        compilerName : "gcc",
        match : ({input}) => input.match(/\.c$/),
    },
    { 
        name:"c++",
        compile : ({output, input}) => (['-o', path.join('main', 'main'), path.join('main', input)]),
        compilerName : "g++",
        match : ({input}) => input.match(/\.cpp$/),
    },
    { 
        name:"go",
        compile : ({output, input}) => (['build','-o', path.join('main', 'main.exe'), path.join('main', input)]),
        compilerName : "go",
        match : ({input}) => input.match(/\.go$/),
        versionArgs: 'version'
    },
    { 
        name:"java",
        compile : ({output, input}) => (['-d', 'main', path.join('main', input)]),
        execute : ({output}) => `java Main`,
        executeFileName: 'Main.class',
        compilerName : "javac",
        match : ({input}) => input.match(/\.java$/),
        versionArgs: '-version'
    },
    { 
        name:"kotlin",
        compile : ({output, input}) => (['-o',path.join('main', output), path.join('main', input)]),
        compilerName : "kotlinc-native",
        match : ({input}) => input.match(/\.kt$/),
        versionArgs: '-version'
    }, 
    { 
        name:"python",
        execute : ({input}) => {
            if(process.platform === "win32") return ['py', input]
                else ['python', input]
        },
        match : ({input}) => input.match(/\.py$/),
    },
    { 
        name:"javascript",
        execute : ({input}) => ['node',input],
        match : ({input}) => input.match(/\.js$/),
    },
    {
        name:"default",
        execute : ({output}) => `main.exe`,
        executeFileName: 'main.exe',
        match : () => true,
        versionArgs: '--version'
    }
]

const setting = getLiveJSON(filePath.setting, {
    input: "main.cpp",
    output: "main",
},(setting) => {
    const langSetting = languageMeta.filter(v => v.match(setting))[0];
    const defaultSetting = languageMeta.filter(v => v.name === "default")[0];

    return {
        versionArgs: langSetting.versionArgs || defaultSetting.versionArgs,
        compilerPath:setting.compilerPaths?.[langSetting.name],
        executeFileName: langSetting.executeFileName || defaultSetting.executeFileName,
        compilerName:langSetting.compilerName,
        languageName:langSetting.name,
        canCompile:langSetting.compile !== undefined,
        compilerArgument:langSetting.compile?.(setting),
        executeOperator:( langSetting.execute || defaultSetting.execute )?.(setting)
    }
})

module.exports = { filePath, languageMeta, setting }

