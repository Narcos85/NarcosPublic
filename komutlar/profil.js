const Discord = require("discord.js");
const db = require('wio.db');
exports.run = (client, message, args) => {

    let sayi = db.fetch(`sayı.${message.author.id}`)

message.channel.send(new Discord.MessageEmbed().setDescription(`${message.author.tag}'ın Profili

İsmi: **${message.author.tag}**
Kayıt Sayısı: **${sayi ? sayi : 0}**`))

   


}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["profilim","p"],
  permLevel: 0
};
exports.help = {
  name: "profil",
  description: "",
  usage: ""
};
   