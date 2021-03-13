const Discord = require("discord.js");
const config = require("../storage/config.json");
const fs = require("fs");
const chalk = require("chalk");
const blist = require("../storage/blacklist.json");

module.exports = {
  name: "blacklisted",
  execute: (message, args) => {

    if(!message.member.roles.some(r=>[config.support_manager_role].includes(r.name))) return message.channel.send(new Discord.RichEmbed()
    .setColor("RED")
    .setTitle(`${message.author.tag}`)
    .setDescription(`:x: **No Permission**\n\nMissing Role - \`Support Manager\``));

    let bl = blist[message.guild.id];

    if(!bl) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Could not find any users in the blacklist.`));
    if(bl.users.length === 0) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Could not find any users in the blacklist.`));

    let embed = new Discord.RichEmbed()
    .setAuthor(`${message.guild.name} Blacklist`, message.guild.iconURL)
    .addField(`Blacklisted Users`, bl.users.join("\n"))
    .setColor(config.color);

    message.channel.send(embed);

  }
}
