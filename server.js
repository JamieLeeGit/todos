const http = require('http');
const headers = require('./service/headers');
const responeHandle = require('./service/responeHandle');
const successHandle = require('./service/successHandle');
const errorHandle = require('./service/errorHandle');
const { v4: uuidv4 } = require('uuid');
const todos = [];

const requestListener = (req, res) => {
    let body = "";

    req.on('data', chunk => {
        body += chunk;
    });

    if(req.url == "/todos" && req.method == "GET"){
        // 查詢全部 todo
        successHandle(res,todos);
    } else if(req.url.startsWith("/todos/") && req.method == "GET"){
        // 查詢單筆 todo
        req.on('end', () => {
            try{                
                const id = req.url.split('/').pop();
                const index = todos.findIndex(element => element.id == id);

                if(index !== -1){                    
                    successHandle(res,todos[index].title);
                }else{
                    errorHandle(res);
                }                
            }catch(err){
                errorHandle(res);
            }
        });
    } else if(req.url == "/todos" && req.method == "POST"){  
        // 新增單筆 todo      
        req.on('end', () => {
            try{
                const title = JSON.parse(body).title;
                if(title !== undefined){
                    const todo = {
                        "title": title,
                        "id": uuidv4()
                    };
                    todos.push(todo);
                    
                    successHandle(res,todos);
                }else{
                    errorHandle(res);
                }                
            }catch(err){
                errorHandle(res);
            }
        });        
    } else if(req.url.startsWith("/todos/") && req.method == "PATCH"){
        // 修改單筆 todo
        req.on('end', () => {
            try{                
                const title = JSON.parse(body).title;
                const id = req.url.split('/').pop();
                const index = todos.findIndex(element => element.id == id);

                if(index !== -1 && title !== undefined){
                    todos[index] = {
                        "title": title,
                        "id": id
                    };
                    
                    successHandle(res,todos);
                }else{
                    errorHandle(res);
                }                
            }catch(err){
                errorHandle(res);
            }
        });
    } else if(req.url.startsWith("/todos/") && req.method == "DELETE"){
        // 刪除單筆 todo
        const id = req.url.split('/').pop();
        const index = todos.findIndex(element => element.id == id);

        if(index !== -1){
            todos.splice(index, 1);

            successHandle(res,todos);
        }else{
            errorHandle(res);
        }
    } else if(req.url == "/todos" && req.method == "DELETE"){
        // 刪除全部 todo
        todos.length = 0;

        successHandle(res,todos);
    }else{
        responeHandle(res, 404, {
            "status": "fail",
            "massage": "無此網站路由"
        });
    }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3001);