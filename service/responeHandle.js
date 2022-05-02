const headers = require('./headers');

function responeHandle(res, statusCode, responeJsonObj){
    res.writeHead(statusCode, headers);
    res.write(JSON.stringify(responeJsonObj));
    res.end();
}

module.exports = responeHandle;