const { asleep } = require('./util')
const fs = require("fs")

const watch = {
    file:(target,callback) => {
        let lastCompile = Date.now()
        const threshold = 100
        fs.watch(target,async function(){
            if( Date.now() - lastCompile < threshold ) return
            lastCompile = Date.now() 
            
            callback(fs.readFileSync(target,"utf-8"));
        })
    },
    json:(target,watchKey,callback) => {
        let value = ''
        async function execute(){
            await asleep(10)
            const raw = fs.readFileSync(target,"utf-8");
            
            const json = JSON.parse(raw)
            if(value !== json[watchKey]){
                value = json[watchKey]
                callback(value)
            }
        }
        watch.file(target,execute)
        return {trigger:() => execute()}
    }
}

function getLiveJSON(fileName = "setting.json",defaultValue = {}){
    return {
        get : function(property){
            try{
                const json = JSON.parse(fs.readFileSync(fileName))
                return json[property] || defaultValue[property]
            } catch {
                console.log(filename+"에 이상이 있습니다. 확인 해 주세요")
            }
        }
    }
}
module.exports = { watch,getLiveJSON }
