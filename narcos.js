const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const ayarlar = require('./ayarlar.json');
require('./util/eventLoader.js')(client);



var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});


client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.member.hasPermission("KICK_MEMBERS")) permlvl = 4;
    if (message.author.id === ayarlar.s) permlvl = 5;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

//giriş - otorol

client.on("guildMemberAdd", async member => {
    const moment = require('moment');
    let user = client.users.cache.get(member.id);
    require("moment-duration-format");
      const tarih = new Date().getTime() - user.createdAt.getTime();  

    var kontrol;
    if (tarih < 1296000000) kontrol = 'Bu Kullanıcı **Şüpheli**'
    if (tarih > 1296000000) kontrol = 'Bu Kullanıcı **Güvenli**'
      moment.locale("tr");

      let tag = ayarlar.tag
    
    if(ayarlar.otorol == true) {
        member.roles.add(ayarlar.otorolr); 
     }
     if(ayarlar.hg == true) {
        client.channels.cache.find(x => x.id === ayarlar.hgk).send(`
         
         » • Hoşgeldin ${member}
 
         » • Seninle birlikte \`${member.guild.memberCount}\` kişiyiz.
         
         » • [ **${tag}** ] Tagımızı alarak ekibimize katılabilirsin.
         
         » • <@&${ayarlar.yetkili}> rolündekiler seninle ilgilenecektir.
         
         » • ${kontrol} 
         
         » • Hesabın Oluşturulma Tarihi: \` ${moment(member.user.createdAt).format("YYYY DD MMMM dddd (hh:mm:ss)")} \`
         
         » • Ses teyit odasında kaydınızı yaptırabilirsiniz. 
        `)//tag yoksa silebilirsiniz
     }
 
  }); 