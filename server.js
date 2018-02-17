var TelegramBot = require('node-telegram-bot-api');
var token = '541428253:AAEQXJyWUkj79-hZzWMe4QYUk3n6OHxw6lQ';
var bot = new TelegramBot(token, {polling: true});
var http = require('http'), port = 300;
var f = require('./functions');
var fs = require("fs");


http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.write('Привет, я телеграм бот!');
    response.write('<style>'+
                    'table {'+
                        'text-align: center;'+
                        'border-collapse: collapse;'+
                    '}'+
                    'th, td {'+
                        'border: solid 1px black;'+
                        'padding: 2px'+
                    '}'+
                    '</style>')

    fs.readFile("result.txt", "utf8", function(error,data){
        if(error) throw error;
        console.log(data);
        var results = data.split(/\r?\n/);
        if(results.length) {
            response.write('<table>');

            var head =  results[0].split(' ');

            response.write('<tr>');
            for(var i = 0; i<head.length; i++) {
                if(head[i].trim()) {
                    response.write('<th>'+head[i].trim()+'</th>');
                }
            }
            response.write('</tr>');

            for (var i = 1; i < results.length; i++) {
                if(results[i].trim()) {
                    response.write('<tr>')
                    var row = results[i].split('#');
                    for (var j = 0; j < row.length; j++) {
                        var value = row[j].trim() == 'undefined' ? '' : row[j].trim();
                        response.write('<td>' + row[j].trim() + '</td>')
                    }
                    response.write('</tr>')
                }
            }

            response.write('</table>');
        }
        response.end();
    });

}).listen(port);

var answer = require('./get_answer');
var log = require('./log')
bot.on('message', function(message) {
   var userId = message.from.id, text = message.text;
   var user = {id: message.from.id, first_name: message.from.first_name, last_name: message.from.last_name,
               username: message.from.username};
   var time = f.timeConverter(message.date)
   log.log_message({'type': 'question', 'text': f.nl2br(text), 'time': time,
                    'user': user});
   var answer_text = answer.get_answer(text, time, user);
   bot.sendMessage(userId, answer_text);
   log.log_message({'type': 'answer', 'text': f.nl2br(answer_text), 'time': time,
                    'user': user});

});



