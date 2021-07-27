const Discord = require('discord.js');
const client = new Discord.Client();
const {log} = require('./lib');
const fs = require('fs');
if (!fs.existsSync(`${__dirname}/../config.js`)) {
    log(`config.js not found, please copy config.sample.js to config.js and edit it`, 'error');	
    process.exit(1);
}
const config = require(`${__dirname}/../config.js`);
if (!config.token) {
    console.log('No token found.');
    process.exit(2);
}

var Guess = require('./guess'),
    guessObj = undefined;

client.login(config.token);

client.on('ready', ()=>{
    log(`Connected as ${client.user.tag}`);
});

client.on('message', message => {
    if (message.author.bot) return;
    if (!fs.existsSync(`${__dirname}/../data`)) {
        fs.mkdirSync(`${__dirname}/../data`);
    }

    if (message.content.startsWith(config.prefix)) {
        const command = message.content.split(' ')[0].slice(config.prefix.length);
        const args = message.content.split(' ').slice(1);
        if (command.toLowerCase() == "start"){
            if (config.hosterType == "user"){
                if (!config.hosters.includes(message.author.id)) {
                    return message.channel.send("You can't because you are not a hoster.");
                }
            } else if (config.hosterType == "role") {
                if (!message.member.roles.some(r => config.hosters.includes(r.id))) {
                    return message.channel.send("You can't because you are not a hoster.");
                }
            }
            if (!args[0]) {
                message.channel.sendMessage("Please enter a word to guess.");
                return;
            }
            if (!guessObj){
                message.delete();
                guessObj = new Guess(args.join(' '), message.author);
                log(message.author.username + " started a new game of Guess!");
                client.channels.fetch(config.channel).then(c=>c.send("A new game of Guess has started! Good luck and have fun!"));
                fs.writeFileSync(`${__dirname}/../data/${guessObj.startDate.toISOString().replace(/:/g, '-')}-${guessObj.hoster.username}.json`, JSON.stringify(guessObj, null, 4));
            } else {
                message.channel.send(`The game has already started!`);
            }
        } else if (command.toLowerCase() == "stop"){
            if (config.hosterType == "user"){
                if (!config.hosters.includes(message.author.id)) {
                    return message.channel.send("You can't because you are not a hoster.");
                }
            } else if (config.hosterType == "role") {
                if (!message.member.roles.some(r => config.hosters.includes(r.id))) {
                    return message.channel.send("You can't because you are not a hoster.");
                }
            }
            if (!guessObj){
                message.channel.send("There is no game to stop!");
            } else {
                guessObj.stop();
                log(message.author.username + " stopped the game!");
                message.channel.send("The game has stopped!");
                guessObj = undefined;
                fs.writeFileSync(`${__dirname}/../data/${guessObj.startDate.toISOString().replace(/:/g, '-')}-${guessObj.hoster.username}.json`, JSON.stringify(guessObj, null, 4));
            }
        }
    } else {
        if (guessObj && guessObj.started && message.channel.id == config.channel) {
            if (guessObj.check(message.content, message.author)) {
                guessObj.stop(true);
                log(`${message.author.tag} won!`);
                message.channel.send('You won!');
            } else {
                log(`${message.author.tag} guessed ${message.content}`);
                message.react('❌');
            }
            fs.writeFileSync(`${__dirname}/../data/${guessObj.startDate.toISOString().replace(/:/g, '-')}-${guessObj.hoster.username}.json`, JSON.stringify(guessObj, null, 4));
        }
    }
});