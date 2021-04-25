require('dotenv').config(); //uses .env file for token instead of putting it directly in the code
const fs = require('fs'); 
const Discord = require('discord.js');
const { listMsgs } = require('./util/scriptsList');
const { actorCollections } = require('./util/turnOrder');



const client = new Discord.Client();
client.commands = new Discord.Collection(); 

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
};

// Upon discord bot being ready, immediately perform a refresh command to get an up-to-date database of scripts from google drive
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  let command = client.commands.get('refresh');
  command.refreshScripts();
});


// If bot is kicked from a guild, delete the corresponding collections
client.on('guildDelete', guild => {
  actorCollections.delete(guild.id);
  listMsgs.delete(guild.id);
})

//Listen for reactions in order to implement the scriptListMsgs function
client.on('messageReactionAdd', (reaction, user) => {
  const msg = reaction.message
  const guild = msg.guild
  const listMsg = listMsgs.get(guild.id)
  if (user.id != client.user.id && listMsg && listMsg.msg == msg) { 
      if (reaction.emoji.name == "\👉")
          listMsg.swap(true) 
      else if (reaction.emoji.name == "\👈")
          listMsg.swap() 
      reaction.users.remove(user);
  }
})

//Leave if alone in a channel
client.on('voiceStateUpdate', (mold, mnew) => {
  let guild = mnew.guild
  let me = guild.me
  
  // Automatically quit voice channel if its empty
  // check if user was in my channel prior to the change
  // if so, if my voice channel exists, and there's only one person, and theres a player for the server
  // count 5 seconds. if i'm still alone after 5 seconds, leave the channel
  if (mold.channel == me.voice.channel) {
      if (me.voice.channel && me.voice.channel.members.array().length == 1) {
          setTimeout(() => {
              if (me.voice.channel.members.array().length == 1) {
                  me.voice.channel.leave();
              }
          }, 5000)
      }
  }

})



//listening for messages
client.on('message', async msg => {
  if (msg.content.indexOf(process.env.PREFIX) !== 0) return; //ignores non prefixed messsages
  if (msg.author.bot || msg.channel.type == "dm") return; //ignores messages from bots or PMs from users 

  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "!say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = msg.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  //error messages for commands
  if (command.vcOnly && !msg.member.voice.channel) return msg.reply("you're not in a voice channel!"); 
  if (command.argsOnly && args.length == 0) return msg.reply("need args!"); //put arg message for each command

  //executes command based on code in separate file
  try {
    await command.execute(msg, args);
   } catch (error) {
     console.error(error);
     botAdmin = process.env.BOT_ADMIN
     client.users.cache.get(botAdmin).send("error: ```" + error + "```");
     msg.reply('there was an error trying to execute that command!');
     msg.channel.send("```" + error + "```");
   }
});

client.login(process.env.BOT_TOKEN);
