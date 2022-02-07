const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'in'), (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    
    console.log(`Processing ${files.length} files...`);

    files.forEach(file => {
        fs.readFile(path.join(__dirname, 'in', file), 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const json = JSON.parse(data);
            console.log(`Processing ${file} with ${json.messages.length} messages...`);

            let text = cleanMessages(json.messages) + "\n\n";

            fs.writeFile(path.join(__dirname, 'out', file.split(".")[0] + ".txt"), text, 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
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