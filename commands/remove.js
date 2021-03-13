const Discord = require("discord.js");
const config = require("../storage/config.json");

module.exports = {
  name: "remove",
  execute: (message, args) => {

    if(!message.member.roles.some(r=>[config.support_team_role].includes(r.name)) && !message.member.roles.some(r=>[config.support_manager_role].includes(r.name))) return message.channel.send(new Discord.RichEmbed()
    .setColor("RED")
    .setTitle(`${message.author.tag}`)
    .setDescription(`:x: **No Permission**\n\nMissing Role - \`Support Team / Manager\``));

    if(!message.channel.name.startsWith(`ticket-`)) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Please use this inside of a ticket.`));

    const chan = message.guild.channels.find(c => c.name === message.channel.name);

    let member = message.mentions.members.first();

    if(!member) return message.channel.send(new Discord.RichEmbed().setDescription(`:x: Usage: \`${config.prefix}remove <@user>\``).setColor("RED"));

    if(message.author.id === member.user.id) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Invalid Operation`));

    if(member.highestRole.position >= message.member.highestRole.position) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Insufficient Permission`));

    message.channel.overwritePermissions(member, {
      VIEW_CHANNEL: false,
      SEND_MESSAGES: false
    })

    message.channel.send(new Discord.RichEmbed().setColor(config.color).setDescription(`:white_check_mark: **${member.user.username}** has been removed from ${chan}`));
  }
}
