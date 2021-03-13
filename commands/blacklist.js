const Discord = require("discord.js");
const config = require("../storage/config.json");
const fs = require("fs");
const chalk = require("chalk");
const blist = require("../storage/blacklist.json");

module.exports = {
  name: "blacklist",
  execute: (message, args) => {

    if(!message.member.roles.some(r=>[config.support_manager_role].includes(r.name))) return message.channel.send(new Discord.RichEmbed()
    .setColor("RED")
    .setTitle(`${message.author.tag}`)
    .setDescription(`:x: **No Permission**\n\nMissing Role - \`Support Manager\``));

    let member = message.mentions.members.first();
    if(!member) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Usage: \`${config.prefix}blacklist <@user>\``));

    if(message.author.id === member.user.id) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Invalid Operation`));

    if(member.highestRole.position >= message.member.highestRole.position) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Insufficient Permission`));

    let bl = blist[message.guild.id];

    if(!bl) {

      blist[message.guild.id] = {
        users: [`<@${member.user.id}>`]
      }

      fs.writeFileSync('./storage/blacklist.json', JSON.stringify(blist));

      message.channel.send(new Discord.RichEmbed().setColor(config.color).setDescription(`:white_check_mark: **${member.user.username}** has been added to the blacklist.`));
      return;
    }

    if(bl.users.includes(`<@${member.user.id}`)) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: That user is already blacklisted.`));

    bl.users.push(`<@${member.user.id}>`);

    fs.writeFileSync('./storage/blacklist.json', JSON.stringify(blist));

    message.channel.send(new Discord.RichEmbed().setColor(config.color).setDescription(`:white_check_mark: **${member.user.username}** has been added to the blacklist.`));
  }
}
