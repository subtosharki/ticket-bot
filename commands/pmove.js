const Discord = require("discord.js");
const config = require("../storage/config.json");
const chalk = require("chalk");
const cache = require("../storage/cache.json");

module.exports = {
  name: "pmove",
  execute: (message, args) => {

    if(!message.member.roles.some(r=>[config.support_team_role].includes(r.name)) && !message.member.roles.some(r=>[config.support_manager_role].includes(r.name))) return message.channel.send(new Discord.RichEmbed()
    .setColor("RED")
    .setTitle(`${message.author.tag}`)
    .setDescription(`:x: **No Permission**\n\nMissing Role - \`Support Team / Manager\``));

    if(!cache[message.channel.id]) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: This channel is not a valid ticket.`));

    let parent = message.guild.channels.find(c => c.name === config.move_tickets_category);
    if(!parent) return console.log(chalk.red(`[ERROR] - Could not find the (${config.move_tickets_category}) category. Please create it or redefine it.`));

    message.channel.setParent(parent);

    message.channel.send(new Discord.RichEmbed().setColor(config.color).setDescription(`:white_check_mark: This ticket has been moved to **${config.move_tickets_category}**.`));
  }
}
