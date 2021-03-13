const Discord = require("discord.js");
const fs = require("fs");
const config = require("../storage/config.json");
const cache = require("../storage/cache.json");
const h = require('hastebin-gen');
const art = require('asciiart-logo');
const date = require("date-and-time");
const index = require("../index.js");
const bot = index.bot;
const chalk = require("chalk");

module.exports = {
  name: "close",
  execute: async (message, args) => {

    if(!message.member.roles.some(r=>[config.support_team_role].includes(r.name)) && !message.member.roles.some(r=>[config.support_manager_role].includes(r.name))) return message.channel.send(new Discord.RichEmbed()
    .setColor("RED")
    .setTitle(`${message.author.tag}`)
    .setDescription(`:x: **No Permission**\n\nMissing Role - \`Support Team / Manager\``));

    let logs = message.guild.channels.find(c => c.name === config.ticket_log);
    if(!logs) return console.log(chalk.red(`[ERROR] - Could not find the (#${config.ticket_log}) channel. Please create it or redefine it.`));
    let logs2 = message.guild.channels.find(c => c.name === config.transcript_log);
    if(!logs2) return console.log(chalk.red(`[ERROR] - Could not find the (#${config.transcript_log}) channel. Please create it or redefine it.`));

    if(!cache[message.channel.id]) return message.channel.send(new Discord.RichEmbed().setColor("RED").setDescription(`:x: This channel is not a valid ticket.`));

    let hi = cache[message.channel.id].host;

    delete cache[message.channel.id];
    delete cache[hi];

    fs.writeFileSync('./storage/cache.json', JSON.stringify(cache));

    var transcript = [];

    const logo = (art ({
      name: `${message.guild.name}`,
      font: 'Standard',
      lineChars: 15,
      padding: 5,
      margin: 2
    })
    .emptyLine()
    .center(`Coded by Medi`)
    .emptyLine()
    .render()
  );

  message.channel.fetchMessages({ limit: 100 })
  .then(messages => {

    const filterBy = bot.user.id;
    messages = messages.filter(m => m.author.id != filterBy).array();
    let m = messages.sort((b, a) => b.createdTimestamp - a.createdTimestamp);

    m.forEach(msg => {

      let now = new Date();
      const edate = date.format(msg.createdAt, 'MM/DD/YYYY h:mm A');

      transcript.push(`${edate} ${msg.author.tag}: ${msg.content}`);
    })

    h(`${logo}\n\n[Transcript]\n\n${transcript.join("\n")}`, 'txt').then(r =>  {

      let embed = new Discord.RichEmbed()
      .setAuthor(`${message.guild.name} Transcripts`, message.guild.iconURL)
      .setColor(config.color)
      .setDescription(`Click [here](${r}) to view the transcript of ${message.channel.name}.`);

      logs2.send(embed);

      logs.send(new Discord.RichEmbed().setColor(config.color).setTimestamp().setFooter(`© ${message.guild.name} | ID: ${message.channel.name}`).setAuthor(`${message.author.tag} has closed a ticket`, message.author.displayAvatarURL));
    })

    message.channel.delete().catch(error => console.log(chalk.yellow(`[WARN] - Unknown Channel`)));
  })
  }
}
