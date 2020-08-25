  // server.js
  // where your node app starts

  // we've started you off with Express (https://expressjs.com/)
  // but feel free to use whatever libraries or frameworks you'd like through `package.json`.
  //const express = require("express");
  const app = express();
  const http = require('http');
  const axios = require("axios");
  const Discord = require("discord.js");
  const client = new Discord.Client();
  const config = process.env
  const prefix = config.prefix
  const ytdl = require('ytdl-core');
  const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const roblox = "Hors Ligne"
  const bot = "Hors Ligne"
  const siteweb = "Hors Ligne"
  const discords = "En ligne"
  const infos = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Etats des serveurs')
    .addFields(
      { name: 'Roblox', value: roblox },
      { name: 'Discord', value: discords},
      { name: 'Bot', value: bot },
      { name: 'Site Web', value: siteweb },
    )
    .setTimestamp()

  // make all the files in 'public' available
  // https://expressjs.com/en/starter/static-files.html
  app.use(express.static("public"));


  // https://expressjs.com/en/starter/basic-routing.html
  app.get("/", (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
  });

  app.get("/stats", (request, response) => {
    response.sendFile(__dirname + "/views/stats/index.html");
  });

  app.get("/spoil", (request, response) => {
    response.sendFile(__dirname + "/views/spoil.html");
  });


  var listener = app.listen(process.env.PORT, function() {
    console.log("Your app is listening on port " + listener.address().port);
  });
  var universeId = process.env.universeId
  app.get("/api/getData", async function(request, response) {
    const res = await axios({
      method: "get",
      url: "https://games.roblox.com/v1/games?universeIds=" + universeId
    });
    const json = await res.data;
    response.send(JSON.stringify(json));
    client.us
  });



  // BOT
  const guildInvites = new Map();
  client.on('inviteCreate', async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
  client.on('guildMemberAdd', async member => {
      const cachedInvites = guildInvites.get(member.guild.id);
      const newInvites = await member.guild.fetchInvites();
      guildInvites.set(member.guild.id, newInvites);
      try {
          const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
        const msgtosend = `Bienvenue ${member.user} tu es le ${member.guild.memberCount+1}ème à rejoindre :D. Si mes calculs sont bons, tu as été invité par ${usedInvite.inviter.tag} et son invitation compte désormais ${usedInvite.uses} invites`
          const embed = new Discord.MessageEmbed()
              .setDescription(`${member.user.tag} est le ${member.guild.memberCount+1}ème à rejoindre.\nInvité par ${usedInvite.inviter.tag}\nNombres d'utilisations: ${usedInvite.uses}`)
              .setTimestamp()
              .setTitle(`${usedInvite.url}`);
          const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === '729753662049615936');
          if(welcomeChannel) {
              welcomeChannel.send(msgtosend).catch(err => console.log(err));
          }
      }
      catch(err) {
          console.log(err);
      }
  });



  function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }


  client.on('message', message => {
    if (message.channel.type != 'text' || message.author.bot)
      return;

    let command = message.content.split(' ')[0].slice(1);
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);

    switch (command) {
      case 'ping': {
      var ping = Date.now() - message.createdTimestamp + " ms";
      message.channel.send("Pong ! (" + `${ping}` + ")");
        break;
      }


      case 'uptime': {
        // client.uptime is in millseconds
        // this is just maths, I won't explain much of it
        // % is modulo, AKA the remainder of a division
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;

        message.channel.send(`__Uptime:__\n${days}j ${hours}h ${minutes}m ${seconds}s`);
        break;
      }
        case 'shutdown': {
          if (message.author.id != config.ownerID)
            return;
                      message.reply('Le bot va s\'éteindre.\n'
                              + 'Confirmez avec `oui` ou `non`.');

                      // First argument is a filter function - which is made of conditions
                      // m is a 'Message' object
                      message.channel.awaitMessages(m => m.author.id == message.author.id,
                              {max: 1, time: 30000}).then(collected => {
                                      // only accept messages by the user who sent the command
                                      // accept only 1 message, and return the promise after 30000ms = 30s

                                      // first (and, in this case, only) message of the collection
                                      if (collected.first().content.toLowerCase() == 'oui') {
                                              message.reply('Arrêt en cours...');
                                              client.destroy()
                                      }

                                      else
                                              message.reply('Opération annulée.');      
                              }).catch(() => {
                                      message.reply('Aucune réponse au bout de 30 secondes, opération annulée.');
                              });
                      break;
              }
      case 'eval': {
        if(message.author.id !== config.ownerID) return;
      try {
        const code = args.join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);

        message.channel.send(clean(evaled), {code:"xl"});
      } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
      }
      case 'createinvite': {
        if(message.author.id === config.ownerID) {
          let channel = message.channel;
        channel.createInvite({unique: true, maxAge: 0})
        .then(invite => {
        message.reply("J'ai créé une invitation : https://discord.gg/" + invite.code)
        })
        }
      }

    }
  });



  // VOCAL
  client.on('message', async message => {
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;

    if (message.content === '^virgin') {
      // Only try to join the sender's voice channel if they are in one themselves
      if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
        connection.play('http://ais-live.cloud-services.paris:8000/virgin.mp3');
        message.reply("<a:disque:741214902940860487> Je joue Virgin Radio sur le salon vocal");
      } else {
        message.reply(":x: Vous n'êtes pas connecté !");
      }
    }
  });




  client.on('message', async message => {
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;

    if (message.content === '^nrj') {
      // Only try to join the sender's voice channel if they are in one themselves
      if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
        connection.play('http://cdn.nrjaudio.fm/audio1/fr/30001/mp3_128.mp3?origine=fluxradios');
        message.reply("<a:disque:741214902940860487> Je joue NRJ sur le salon vocal");
      } else {
        message.reply(":x: Vous n'êtes pas connecté !");
      }
    }
  });




  client.on('ready', () => {
  //client.user.setPresence({ activity: { name: 'Bocognano RP' }, status: 'Online' }) 
    client.user.setActivity('🚧 En maintenance 🚧', { type: 'WATCHING'}).catch(console.error);
  console.log("Connecté à Discord")
        client.guilds.cache.forEach(guild => {
          guild.fetchInvites()
              .then(invites => guildInvites.set(guild.id, invites))
              .catch(err => console.log(err));
      });

  // const channel = client.channels.cache.get('733004433054761020'); // 732647630714437682
  //channel.send(infos);
     //const findemaintenance = new Discord.MessageEmbed()
     //.setTitle("Maintenance")
     //.setDescription("Fin de la maintenance")
     //.setColor(0xff0000)
     //.addField("Rapport", "Sans succès")
     //.addField("Modifications", "Echec du changement d'hébergeur")
   //const mtn = client.channels.cache.get('729754334069391461');
   //mtn.send(findemaintenance);
  })

  // POLL SYSTEM
  const userCreatedPolls = new Map();

  client.on('message', async message => {
      if(message.author.bot) return;
      if(message.content.toLowerCase() === '!createpoll') {
          if(userCreatedPolls.has(message.author.id)) {
              message.channel.send(":x: Vous avez déjà un sondage en cours.");
              return;
          }
          message.channel.send("Entrez les options (Minimum 2). Une fois terminé, écrivez 'done'.");
          let filter = m => {
              if(m.author.id === message.author.id) {
                  if(m.content.toLowerCase() === 'done') collector.stop();
                  else return true;
              }
              else return false;
          }
          let collector = message.channel.createMessageCollector(filter, { maxMatches: 5 });
          let pollOptions = await getPollOptions(collector);
          if(pollOptions.length < 2) {
              message.channel.send(":x: Opération Annulée : Vous devez avoir minimum 2 options !");
              return;
          }
          let embed = new Discord.MessageEmbed();
          embed.setTitle("Sondage");
          embed.setDescription(pollOptions.join("\n"));
          let confirm = await message.channel.send(embed);

          await confirm.react('✅');
          await confirm.react('❎');

          let reactionFilter = (reaction, user) => (user.id === message.author.id) && !user.bot;
          let reaction = (await confirm.awaitReactions(reactionFilter, { max: 1 })).first();
          if(reaction.emoji.name === '✅') {
              message.channel.send(":white_check_mark: Le vote commencera dans 10 secondes.");
              await delay(10000);
              message.channel.send("Votez !");
            message.channel.send("Pour voter, vous devez simplement écrire l'une des options données.")
              let userVotes = new Map();
              let pollTally = new Discord.Collection(pollOptions.map(o => [o, 0]));
              let pollFilter = m => !m.bot;
              let voteCollector = message.channel.createMessageCollector(pollFilter, {
                  time: 60000
              });
              userCreatedPolls.set(message.author.id, voteCollector);
              await processPollResults(voteCollector, pollOptions, userVotes, pollTally);
              let max = Math.max(...pollTally.array());
              console.log(pollTally.entries());
              let entries = [...pollTally.entries()];
              let winners = [];
              let embed = new Discord.MessageEmbed();
              let desc = '';
              entries.forEach(entry => entry[1] === max ? winners.push(entry[0]) : null);
              entries.forEach(entry => desc  += entry[0] + " à reçu " + entry[1] + " vote(s)\n");
              embed.setDescription(desc);

              if(winners.length === 1) {
                  message.channel.send(winners[0] + " à reçu la majorité ", embed);
              }
              else {
                  message.channel.send("Résultats du vote", embed);
              }
          }   
          else if(reaction.emoji.name === '❎') {
              message.channel.send(":white_check_mark: Sondage annulé.");
          }
      }
      else if(message.content.toLowerCase() === '!stopvote') {
          if(userCreatedPolls.has(message.author.id)) {
              console.log("Trying to stop poll.");
              userCreatedPolls.get(message.author.id).stop();
              userCreatedPolls.delete(message.author.id);
          }
          else {
              message.channel.send(":x: Aucun sondage n'est en cours actuellement !");
          }
      }
  });

  function processPollResults(voteCollector, pollOptions, userVotes, pollTally) {
      return new Promise((resolve, reject) => {
          voteCollector.on('collect', msg => {
              let option = msg.content.toLowerCase();
              if(!userVotes.has(msg.author.id) && pollOptions.includes(option)) {
                  userVotes.set(msg.author.id, msg.content);
                  let voteCount = pollTally.get(option);
                  pollTally.set(option, ++voteCount);
              }
          });
          voteCollector.on('end', collected => {
              console.log("Collected " + collected.size + " votes.");
              resolve(collected);
          })
      });
  }

  function getPollOptions(collector) {
      return new Promise((resolve, reject) => {
          collector.on('end', collected => resolve(collected.map(m => m.content.toLowerCase())));
      });
  }

  function delay(time) {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve();
          }, time)
      })
  }


  client.on('error', (err) => {
  client.channels.get(`729753662049615936`).send(`Oops! Robert n'a pas pu executé votre requête. Veuillez réessayez. Si le problème persiste, veuillez contacter un Administrateur. Erreur de débogage: ${err}`)


  });

  client.login(config.token)