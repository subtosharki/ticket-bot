const Discord = require("discord.js");
const config = require("../storage/config.json");

module.exports = {
  name: "add",
  execute: (message, args) => {

    if(!message.member.roles.some(r=>[config.support_team_role].includes(r.name)) && !message.member.roles.some(r=>[config.support_manager_role].includes(r.name))) return message.channel.send(new Discord.RichEmbed()
    .setColor("RED")
    .setTitle(`${message.author.tag}`)
    .setDescription(`:x: **No Permission**\n\nMissing Role - \`Support Team / Manager\``));

    let member = message.mentions.members.first();
    
    if(!member) return message.channel.send(new Discord.RichEmbed().setDescription(`:x: Usage: \`${config.prefix}add <@user> <#channel>\``).setColor("RED"));

    if(message.author.id === member.user.id) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Invalid Operation`));

    if(!args[1]) return message.channel.send(new Discord.RichEmbed().setDescription(`:x: Usage: \`${config.prefix}add <@user> <#channel>\``).setColor("RED"));

    let chan = args[1].substring(2, args[1].length - 1);

    if(!message.guild.channels.has(chan)) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Invalid Channel`));

    const channels = message.mentions.channels;
    const chanName = channels.map(channel => channel.name);
    const chanz = message.guild.channels.find(c => c.name === `${chanName}`);

    if(!chanz.name.includes(`ticket-`)) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Channel is not a ticket.`));;

    chanz.overwritePermissions(member, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true
    })

    message.channel.send(new Discord.RichEmbed().setColor(config.color).setDescription(`:white_check_mark: **${member.user.username}** has been added to ${chanz}`));
  }
}
