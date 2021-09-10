var Promise=require('bluebird')
var _=require('lodash')
const qnabot = require("/opt/lib/logging")


module.exports=class router {
    constructor(){
        this.middleware=[] 
    }

    async start(event,callback){
        try{
            var res=await this._walk( {_event:event})
            callback(null,res)
        }catch(e){
            qnabot.log("throwing response:",e)
            if(e.action==='END'){
                callback(null)
            }else if(e.action==="RESPOND"){
                callback(null,e.message)
            }else{
                callback(e)
            }
        }
        
    }
    async _walk(req,res={},index=0){

        if(this.middleware[index]){
            qnabot.log(`middleware=${this.middleware[index].name}`)
            var result=await this.middleware[index](req,res)
            return await this._walk(result.req,result.res,++index)
        }else{
            return _.get(res,"out",res)
        }
    }
    add(fnc){
        this.middleware.push(fnc)
    }
}



