const Discord = require("discord.js");
const config = require("../storage/config.json");
const cache = require("../storage/cache.json");

module.exports = {
  name: "rename",
  execute: (message, args) => {

    if(!message.member.roles.some(r=>[config.support_team_role].includes(r.name)) && !message.member.roles.some(r=>[config.support_manager_role].includes(r.name))) return message.channel.send(new Discord.RichEmbed()
    .setColor("RED")
    .setTitle(`${message.author.tag}`)
    .setDescription(`:x: **No Permission**\n\nMissing Role - \`Support Team / Manager\``));

    if(!cache[message.channel.id]) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Please use this inside of a ticket.`));

    let name = args.slice(0).join("-");
    if(!name) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Usage: \`${config.prefix}rename <name>-\``));
    let oldname = message.channel.name.slice(7);

    message.channel.setName(`${name} ${oldname}`);

    message.channel.send(new Discord.RichEmbed().setColor(config.color).setDescription(`:white_check_mark: This ticket has been renamed.`));
  }
}
