const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'in'), (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    files.forEach(file => {
        fs.readFile(path.join(__dirname, 'in', "hub.json"), 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const json = JSON.parse(data);
            console.log(cleanMessages(json.messages))
        });
    });
});

function cleanMessages(messages) {
    var cleanMessages = "";

    let lastMessage = messages[0];

    messages.forEach(message => {
        // Deserialize timestamp
        message.timestamp = new Date(message.timestamp);

        // Only process messages that are not from a bot
        if (!isInvalid(message)) {
            let cleanedMessage = message.content.replace(/\n/g, ". ");

            // If there is a delay of more than ten minutes between messages, add a new group
            if (message.timestamp - lastMessage.timestamp > 1000 * 60 * 10) {
                cleanMessages += "\n\n\n" + message.content;
            }
            // Else process this as a response or continuation of the previous message
            else {
                // If the author is the same as the last author, concat the content as a continuation of the previous message
                if (lastMessage.author.id === message.author.id) {
                    cleanMessages += ". " + cleanedMessage;
                }
                // Else add a newline and the content, as a response
                else {
                    cleanMessages += "\n" + cleanedMessage;
                }
            }

            lastMessage = message;
        }
    });

    return cleanMessages;
}

function isInvalid(message) {
    if (message.author.isBot) return true;

    if (message.type !== 'Default') return true;

    return message.content.startsWith("!") || 
    message.content.startsWith("$") || 
    message.content.startsWith(".") || 
    message.content.startsWith("-") || 
    message.content.startsWith(".") || 
    message.content.startsWith("edy:") || // edy is a bot
    message.content.startsWith("@EdyBot");
}