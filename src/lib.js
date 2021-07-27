// Console logging with colors for errors and warnings etc...
function log(message, type = "info"){
    var colors = {
        error: '\u001b[31m',
        warning: '\u001b[33m',
        info: '\u001b[37m',
        debug: '\u001b[32m'
    };
    var end = '\u001b[39m';
    console.log(colors[type] + type.toUpperCase() + ': ' + message + end);
}

module.exports = {
    log
};