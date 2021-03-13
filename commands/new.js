const Discord = require("discord.js");
const fs = require("fs");
const config = require("../storage/config.json");
const count = require("../storage/count.json");
const blist = require("../storage/blacklist.json");
const cache = require("../storage/cache.json");
const chalk = require("chalk");

module.exports = {
  name: "new",
  execute: async (message, args) => {

    const st = message.guild.roles.find(r => r.name === config.support_team_role);
    if(!st) return console.log(chalk.red(`[ERROR] - Could not find the (${config.support_team_role}) role. Please create it or redefine it.`));
    const sm = message.guild.roles.find(r => r.name === config.support_manager_role);
    if(!sm) return console.log(chalk.red(`[ERROR] - Could not find the (${config.support_manager_role}) role. Please create it or redefine it.`));
    const logs = message.guild.channels.find(c => c.name === config.ticket_log);
    if(!logs) return console.log(chalk.red(`[ERROR] - Could not find the (#${config.ticket_log}) channel. Please create it or redefine it.`));

    if(!message.member.roles.some(r=>[config.support_team_role].includes(r.name)) && !message.member.roles.some(r=>[config.support_manager_role].includes(r.name))) {

      if(blist[message.guild.id]) {

        if(blist[message.guild.id].users.includes(`<@${message.author.id}>`)) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: You are blacklisted from creating tickets.`));
      }

      if(cache[message.author.id]) {

        if(cache[message.author.id].count === config.max_tickets) {

          message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: You can only have \`${config.max_tickets}\` ticket(s) in this server! You have \`${config.max_tickets}\`.`))
          return;
        }

        cache[message.author.id].count = cache[message.author.id].count + 1;
        fs.writeFileSync('./storage/cache.json', JSON.stringify(cache));
      }

      var reason = args.slice(0).join(" ") || "No Reason";
      var parent = message.guild.channels.find(c => c.name === config.ticket_category) || null;
      let tc = count[message.guild.id];
      var tcc = "";

      if(tc) var tcc = count[message.guild.id].num;

      if(!tc) {

        count[message.guild.id] = {
          num: 1
        }

        fs.writeFileSync('./storage/count.json', JSON.stringify(count));

        var tcc = 1;

      }

      if(tc) {

        count[message.guild.id].num = count[message.guild.id].num + 1;
        fs.writeFileSync('./storage/count.json', JSON.stringify(count));

        var tcc = count[message.guild.id].num;
      }

      if(!cache[message.author.id]) {

        cache[message.author.id] = {
          count: 1
        }

        fs.writeFileSync('./storage/cache.json', JSON.stringify(cache));

      }

      message.guild.createChannel(`ticket-${tcc}`, 'text').then(async channel => {

        channel.setParent(parent);
        channel.overwritePermissions(message.author.id, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true
        })
        channel.overwritePermissions(channel.guild.defaultRole, {
          VIEW_CHANNEL: false,
          SEND_MESSAGES: false
        })
        channel.overwritePermissions(st, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true
        })
        channel.overwritePermissions(sm, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true
        })

        cache[channel.id] = {
          host: message.author.id
        }

        fs.writeFileSync('./storage/cache.json', JSON.stringify(cache));

        let embed = new Discord.RichEmbed()
        .setDescription(`Dear ${message.author},\n\nThank you for reaching out to our support team!\nWe will get back to you as soon as possible.`)
        .addField(`Subject`, reason)
        .setFooter(`© ${message.guild.name}`, message.guild.iconURL)
        .setTimestamp()
        .setColor(config.color);

        channel.send("<@&523266171257094144> " + message.author , embed);

        message.channel.send(new Discord.RichEmbed().setColor(config.color).setDescription(`:white_check_mark: Your ticket has been created ${channel}`));

        logs.send(new Discord.RichEmbed().setColor(config.color).setTimestamp().setFooter(`© ${message.guild.name} | ID: ${channel.name}`).setAuthor(`${message.author.tag} has created a ticket`, message.author.displayAvatarURL));
      });
      return;
    }

    let member = message.mentions.members.first();

    if(!member) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Usage: \`${config.prefix}new @user\``));

    if(member) {

      if(blist[message.guild.id]) {

        if(blist[message.guild.id].users.includes(`<@${member.user.id}>`)) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: That user is blacklisted from creating tickets.`));
      }

      if(message.author.id === member.user.id) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: Invalid Operation`));

      if(cache[member.user.id]) {

        if(cache[member.user.id].count === config.max_tickets) {

          message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: ${member.user} has \`${config.max_tickets}\` ticket(s) in this server! The max is set to \`${config.max_tickets}\`.`))
          return;
        }

        cache[member.user.id].count = cache[member.user.id].count + 1;
        fs.writeFileSync('./storage/cache.json', JSON.stringify(cache));
      }

      var reason = args.slice(1).join(" ") || "No Reason";
      var parent = message.guild.channels.find(c => c.name === config.ticket_category) || null;
      let tc = count[message.guild.id];
      var tcc = "";

      if(tc) var tcc = count[message.guild.id].num;

      if(!tc) {

        count[message.guild.id] = {
          num: 1
        }

        fs.writeFileSync('./storage/count.json', JSON.stringify(count));

        var tcc = 1;

      }

      if(tc) {

        count[message.guild.id].num = count[message.guild.id].num + 1;
        fs.writeFileSync('./storage/count.json', JSON.stringify(count));

        var tcc = count[message.guild.id].num;
      }

      if(!cache[member.user.id]) {

        cache[member.user.id] = {
          count: 1
        }

        fs.writeFileSync('./storage/cache.json', JSON.stringify(cache));

      }

      message.guild.createChannel(`ticket-${tcc}`, 'text').then(async channel => {

        channel.setParent(parent);
        channel.overwritePermissions(member.user.id, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true
        })
        channel.overwritePermissions(channel.guild.defaultRole, {
          VIEW_CHANNEL: false,
          SEND_MESSAGES: false
        })
        channel.overwritePermissions(st, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true
        })
        channel.overwritePermissions(sm, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true
        })

        cache[channel.id] = {
          host: member.user.id
        }

        fs.writeFileSync('./storage/cache.json', JSON.stringify(cache));

        let embed = new Discord.RichEmbed()
        .setDescription(`Dear ${member.user},\n\nThank you for reaching out to our support team!\nWe will get back to you as soon as possible.`)
        .addField(`Subject`, reason)
        .setFooter(`© ${message.guild.name}`, message.guild.iconURL)
        .setTimestamp()
        .setColor(config.color);

        channel.send(`<@&523266171257094144> ${member.user} `, embed);

        message.channel.send(new Discord.RichEmbed().setColor(config.color).setDescription(`:white_check_mark: Your ticket has been created ${channel}`));

        logs.send(new Discord.RichEmbed().setColor(config.color).setTimestamp().setFooter(`© ${message.guild.name} | ID: ${channel.name}`).setAuthor(`${member.user.tag} has created a ticket`, member.user.displayAvatarURL));
      });
    }
  }
}
