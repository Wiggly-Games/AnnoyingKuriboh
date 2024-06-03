# Description
This is a Discord Bot that generates random text trained on a data set of all of Weird Al's song lyrics. When added to a server, the server administrators are able to control trigger phrases within that server that the bot will respond to. Once it sees one of these phrases, it'll respond with a randomly generated phrase tagging that user.

# Usage
## Server Installations
When installed to a server, the bot will listen for trigger words that come up and respond to them with random messages. Server owners are able to configure their server to adjust the trigger words that the bot should listen for, so that it can apply more directly with the theme of your server.

### Trigger Words
Trigger words are phrases that the bot responds to. Previously, these would be things like "meow irl", "woof irl", "froggo irl", tagging the bot, etc.; you're now able to modify them so that the bot will look for specific messages within your server. To control them, please use the `/trigger` slash command, which takes either:
- `/triggers add [TRIGGER PHRASE] [Text to append to responses]`
- `/triggers remove [TRIGGER PHRASE]`
- `/triggers get`

### Cooldowns
You can also control how long the bot will wait between sending messages using the `/cooldown` command. This allows you to adjust how often the bot can respond within your server, to avoid the bot from spamming your users.

## Global Installations
When globally installed, Kuriboh will provide users with a `/generate` command. This command will trigger the bot to respond to your message with some randomly generated text. This allows you to run the bot from anywhere.

Please note that the global installation only works on servers with fewer than 100 people.

# Privacy Policy
We have a privacy policy! It's on our [GitHub](https://github.com/Wiggly-Games/AnnoyingKuriboh/blob/main/PrivacyPolicy.md).

# Contributions
Feel free to contribute, post issues, etc.! We have a [support server](https://discord.gg/zQAdUeA37T) where you can ask for help or post about issues, and you're free to post issues to the GitHub page as well.