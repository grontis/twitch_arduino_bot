const tmi = require('tmi.js'); //twitch messaging interface library
const fs = require('fs'); //filestream library
const SerialPort = require('serialport'); // include the serialport library




//Get config data from config.json
var content = fs.readFileSync("config.json");
var jsonContent = JSON.parse(content);
//Config Data:
var username = jsonContent.username;
var password = jsonContent.password;
var channels = jsonContent.channels;
var portName = jsonContent.portName;


// Define twitch configuration options using config.json file
const opts = {
    identity: {
        username: username,
        password: password
    },
    channels: channels
};


// serial port initialization:
var myPort = new SerialPort(portName, 9600);// open the port


// these are the definitions for the serial events:
myPort.on('open', openPort); // called when the serial port opens
function openPort() {
    console.log('Arduino serial port '+portName+' open');
}


// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandName = msg.trim();

    // If the command is known, let's execute it
    if (commandName === '!dice') {
        const num = rollDice();
        client.say(target, `You rolled a ${num}`);
        console.log(`* Executed ${commandName} command`);
    }
    else if(commandName== '!light'){
        sendSerialString("on");
        client.say(target, `ITS LIT`);
        console.log(`* Executed ${commandName} command`);
    }
    else {
        console.log(`* Unknown command ${commandName}`);
    }
}

// Function called when the "dice" command is issued
function rollDice () {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}

function sendSerialString(commandString) {
    myPort.write(commandString);
    console.log('Sending serial data to arduino');
}