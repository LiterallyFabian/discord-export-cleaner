# discord-export-cleaner
Node.js script to clean up Discord chat exports made with [Tyrrrz/DiscordChatExporter](https://github.com/Tyrrrz/DiscordChatExporter) to make them usable for AI training. 

## Usage
Place all your .json files retreived from [DiscordChatExporter](https://github.com/Tyrrrz/DiscordChatExporter) in a directory called `in/` and run the script.

```bash
node index.js
```

Your cleaned files will be placed in the `out/` directory.

In case you have multiple chat logs you might want to concatenate them:
```bash
copy /b *.txt concat.txt
```

## Why?
This code is used to clean up training data for my Discord AI bot. The issue with raw exports is that text chats are usually of low quality, with content split up across multiple messages, which this project aims to solve.

### How?

Pretend we have this chat log:

![Example](https://i.imgur.com/6ZbIVRI.png)

An uncleaned parse would look something like this:

```
hey
i gotta tell you something
it's really cool
oh?
nvm i forgot
```

If you train an AI on this it will assume that "i gotta tell you something" is something one would reply to "hey", but that's not correct. This can be solved by concatenating messages sent from the same author. Cleaned data would look like this:

```
hey. i gotta tell you something. it's really cool
oh?
nvm i forgot
```

## Additional features

- Bot commands are ignored (slash commands, normal messages starting with common prefixes like - / $)
- Messages from bots are ignored
- A 10 minute delay between two messages means that the conversation ended
