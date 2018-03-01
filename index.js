const request = require('request');
const fs = require('fs');

var verbose = false;

if (process.argv.indexOf("-v") >= 0 || process.argv.indexOf("--verbose") >= 0) {
    verbose = true;
}

var config = {};
var text = "";
if (!fs.existsSync('./config.json')) {
    config["id"] = "hostname";
    config["pw"] = "password";
    config["ip"] = "ip to point (let blank for current ip)";
    config["delay"] = 120000;
    fs.writeFileSync('./config.json', JSON.stringify(config));
    console.error('Please configure the newly created config.json');
    process.exit(-1);
}
else {
    text = fs.readFileSync('./config.json');
    config = JSON.parse(text);
}

var args = "id=" + config.id;
args += "&pw=" + config.pw;
if (config.ip !== "") {
    args += "&ip=" + config.ip;
}
args += "&client=NodeDtDUp";

if (verbose === true) {
    log('Delay set to ' + config.delay);
    if (config.ip) {
        log('Pointed ip is ' + config.ip);
    }
    else {
        log('Pointed ip is current ip');
    }
    log('Lanched it verbose mode');
}

function update() {
    request('https://www.dtdns.com/api/autodns.cfm?' + args, (err, res, body) => {
        if (err && verbose === true) {
            console.error(err);
        }
        if (verbose === true) {
            log('Updated client with response : ' + body);
        }
    });
}

function log(message) {
    let date = new Date();
    console.log('[' + date.getFullYear() + '/' + date.getDate() + '/' + (date.getMonth() + 1) + '-' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ']' + message);
}

setInterval(update, config.delay);