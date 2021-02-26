const { Discord, MessageEmbed} = require('discord.js')
const db = require('wio.db');
const ayarlar = require('../ayarlar.json')


exports.run = async (client, message, args) => {

    let kadın = ayarlar.kadın 
    let kayıtsız = ayarlar.kayıtsız
   
    let yetkili = ayarlar.yetkili


    if(!message.member.roles.cache.has(yetkili)) return message.channel.send('Bu işlemi sadece yetkililer yapabilir')


if(!args[0]) return message.channel.send(`Bir kişiyi etiketlemelisin.`)
  
let kullanıcı = message.mentions.users.first()
if(!kullanıcı) return message.channel.send(`${args[0]}, kullanıcısını sunucuda bulamıyorum.`)

  
  

  
let isim = args[1]

if(!isim) return message.channel.send(`Üyenin ismini belirtmelisin.`)

let yaş = args[2];
if(!yaş) return message.channel.send(`Üyenin yaşını belirtmelisin.`)
  

let tag = ayarlar.tag
message.guild.members.cache.get(kullanıcı.id).setNickname(`${tag} ${isim} • ${yaş}`)
  message.guild.members.cache.get(kullanıcı.id).roles.add(kadın)

  
message.guild.members.cache.get(kullanıcı.id).roles.remove(kayıtsız)

let embed3 = new MessageEmbed()
.setColor('WHITE')
.setTimestamp()
.setDescription(`
• ${kullanıcı} adlı kişinin kaydı başarıyla yapıldı.
• İsim Yaş • **${isim} • ${yaş}**
• Verilen Roller • <@&${ayarlar.kadın}>
• Alınan Roller • <@&${ayarlar.kayıtsız}>

`)
message.channel.send(embed3).then(m => m.delete({timeout : '5000'}))
message.react(`✅`)
db.add(`sayı.${message.author.id}`, 1)


}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['k'],
  permLevel: 0
};

exports.help = {
  name: 'kadın'
}