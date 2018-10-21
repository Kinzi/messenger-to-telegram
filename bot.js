if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
  }
var fs = require('fs');
var btn = require('./utils');
var util = require('util');
const login = require('facebook-chat-api');
var TelegramBot = require('node-telegram-bot-api');
var token = process.env.TELEGRAM_TOKEN;
var bot = new TelegramBot(token, {
    polling: true
});
var chatId = process.env.TELEGRAM_CHAT_ID;

var currentThread = '';

let credentials = {
    email: process.env.FB_EMAIL,
    password: process.env.FB_PASSWORD
};

if (fs.existsSync('appstate.json')) {
    credentials = {
        appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))
    }
}

login(credentials, function callback(err, api) {
    if (err) return console.error(err);
    // Save Session
    console.log('Save session to appstate.json');
    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));

    api.listen(function callback(err, message) {

        api.getUserInfo([message.threadID], function (err, ret) {
            if (err) return console.error(err);
            var name = "";
            for (var prop in ret) {
                if (ret.hasOwnProperty(prop) && ret[prop].name) {
                    name = ret[prop].name
                }
            }
            switch (message.type) {
                case "message":
                    bot.sendMessage(chatId, name + ' (Messenger): ' + message.body, btn.inlineReply('✏️ Respond to ' + name, message.threadID));
                    break;
                case 'read_receipt':
                    bot.sendMessage(chatId, name + ' (Messenger): ✅ Viewed ✅');
                    break;
                default:
                    bot.sendMessage(chatId, ' ERROR: NO EXISTE DE TIPO '+ message.type);
            }

        });


    });

    bot.on('callback_query', function(msg) {
        var user = msg.from.id;
        var data = msg.data;
        currentThread = data;
        bot.sendMessage(msg.from.id, "Write your message to '" + data + "'");
    });

    bot.on('message', function (msg) {
        console.log(msg.text);
        if (currentThread !== "") {
            api.sendMessage(msg.text, currentThread);
            bot.sendMessage(chatId, 'Message send');

        } else {
            bot.sendMessage(chatId, 'The person to answer to has not been selected');
        }

    });

    bot.on('photo', function(msg) {
        if (currentThread !== "") {
            bot.downloadFile(msg.photo[msg.photo.length - 1].file_id, './images').then(function(path) {
                console.log(path);
                var msg = {
                    body: "",
                    attachment: fs.createReadStream(path)
                }
                api.sendMessage(msg, currentThread);

            });


        } else {
            bot.sendMessage(chatId, 'The person to send the photo to has not been selected');
        }

    });

});