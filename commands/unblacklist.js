const Discord = require("discord.js");
const config = require("../storage/config.json");
const fs = require("fs");
const chalk = require("chalk");
const blist = require("../storage/blacklist.json");

module.exports = {
  name: "unblacklist",
  execute: (message, args) => {

    if(!message.member.roles.some(r=>[config.support_manager_role].includes(r.name))) return message.channel.send(new Discord.RichEmbed()
    .setColor("RED")
    .setTitle(`${message.author.tag}`)
    .setDescription(`:x: **No Permission**\n\nMissing Role - \`Support Manager\``));

    let member = message.mentions.members.first();
    if(!member) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Usage: \`${config.prefix}unblacklist <@user>\``));

    if(message.author.id === member.user.id) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Invalid Operation`));

    let bl = blist[message.guild.id];

    if(!bl) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Could not find any users in the blacklist.`));

    if(!bl.users.includes(`<@${member.user.id}>`)) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: That user is not blacklisted.`));

    bl.users.splice(bl.users.indexOf(`<@${member.user.id}>`), 1);

    fs.writeFileSync('./storage/blacklist.json', JSON.stringify(blist));

    message.channel.send(new Discord.RichEmbed().setColor(config.color).setDescription(`:white_check_mark: **${member.user.username}** has been removed from the blacklist.`));
  }
}
