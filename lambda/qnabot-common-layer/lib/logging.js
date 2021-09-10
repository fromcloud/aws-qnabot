module.exports={
    log: function(...messages){
        console.log(messages.reduce((message,text) => message + " " + filter(text)))
    }
}

function filter_comprehend_pii(text){
    if(!process.env.found_comprehend_pii ){
        return text
    }

    let regex = process.env.found_comprehend_pii.split(",").map(pii => `(${pii})`).join("|")
    let re = new RegExp(regex, "gm");

    return text.replace(re, "XXXXXX");

}
const filter = text => {


    if (process.env.DISABLECLOUDWATCHLOGGING === "true") {
        return "cloudwatch logging disabled";
    } else {
        let isObject = false
        // always redact jwts
        if(typeof text === "object"){
            text = JSON.stringify(text)
            isObject = true
        }
        if(typeof text !== 'string'){
            text = String(text)
        }
        if(text === undefined){
            return ""
        }
        text = text.replace(/"accesstokenjwt":\s*"[^"]+?([^\/"]+)"/g, '"accesstokenjwt":"<token redacted>"');
        text = text.replace(/"idtokenjwt":\s*"[^"]+?([^\/"]+)"/g, '"idtokenjwt":"<token redacted>"');
        text = text.replace(/"refreshtoken":\s*"[^"]+?([^\/"]+)"/g, '"refreshtoken":"<token redacted>"');
        if (process.env.QNAREDACT === "true") {
            text = filter_comprehend_pii(text)
            let re = new RegExp(process.env.REDACTING_REGEX, "gm");
            text =  text.replace(re, "XXXXXX");
        }
        return text
    }
};