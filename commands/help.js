require('dotenv').config() //needed for prefix


module.exports = {
	name: 'help',
	description: 'displays this list!',
	aliases: ['commands'],
	execute(msg, args) {
		const data = [];
		const { commands } = msg.client;

		const prefix = process.env.PREFIX;
		let availableCommands = commands;
		let commandNames = commands.map(command => command.name);

		//sends all commands if just a "!help" command
		if (!args.length) { 
			data.push('here\'s a list of all my commands available to you currently:');
			data.push(commandNames.join(', '));
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command. \r\n**you will need to type that in the server though, i'm set to ignore PMs!**`);
			
			return msg.author.send(data, { split: true })
				.then(() => {
					if (msg.channel.type === 'dm') return;
					msg.reply('commands sent!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${msg.author.tag}.\n`, error);
					msg.reply('it seems like I can\'t DM you! do you have DMs disabled?');
				});
			}
		
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
		
		if (!command) {
			return msg.reply('that\'s not a valid command!');
		}
		
		//sends specific command info if "!help" had an argument
		data.push(`**Name:** ${command.name}`);
		
		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
  		
		msg.channel.send(data, { split: true });
		
	},
};