const Discord = require('discord.js');
const emoji = require('discord-emoji-convert');
const bot = new Discord.Client();
const fs = require('fs');
const ms = require('ms');
const config = require('./storage/config.json');
const prefix = config.prefix;
const chalk = require("chalk");

exports.bot = bot;
bot.commands = new Discord.Collection();

bot.on('error', console.error);

// Bot isEnabled
bot.on('ready', async () => {

  try {

    // Command Handler
    const commandFiles = fs.readdirSync("./commands");
    commandFiles.forEach((file) => {
      const command = require(`./commands/${file}`);
      bot.commands.set(command.name, command);
    });

    setTimeout(async function() {
      console.log(chalk.white(`[${chalk.green(`INFO`)}${chalk.white(`] - Connecting...`)}`));
    }, ms('1s'));
    setTimeout(async function() {
      console.log(chalk.white(`[${chalk.green(`INFO`)}${chalk.white(`] - Logged in as: ${bot.user.tag}`)}`));
    }, ms('3s'));
    console.log("");

  } catch(e) {

    console.log(chalk.red(`${e.stack}`));
  }
});

// Listener
bot.on("message", async(message) => {

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift();

  if (message.channel.type != "text") return;
  if (message.author.bot) return;

  if (message.author.bot && message.content.startsWith(prefix)) return;
  if (!message.content.startsWith(prefix)) return;

  let cmd = bot.commands.get(command.toLowerCase());
  if (cmd) cmd.execute(message,args);
});
bot.login(config.token);
