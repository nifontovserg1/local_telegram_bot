var fs = require("fs");

module.exports.log_message = function(message) {
    var last_name = message.user.last_name?message.user.last_name:'', user_name =  message.user.username?message.user.username:'';
    var loggin_message = message.type+'# '+message.text+'# '+message.time+'# '+message.user.id+'# '+message.user.first_name+'# '+last_name+'# '+user_name;

    if(!fs.existsSync("log.txt")) {
        fs.openSync("log.txt", 'a')
        fs.closeSync("log.txt")
    }

    var current_content = fs.readFileSync("log.txt", "utf8");
    if(!current_content.trim()) {
        fs.writeFileSync("log.txt", "type text date user_id first_name last_name user_name\r\n");
    }
    fs.appendFile("log.txt", loggin_message+' \r\n', function(error){
        if(error) throw error;
        var data = fs.readFileSync("log.txt", "utf8");
    });
}


