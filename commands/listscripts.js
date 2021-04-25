const db = require('../dbObjects');
const { ScriptsList } = require('../util/scriptsList');

module.exports = {
	name: 'listscripts',
	aliases: ['list', 'scripts'],
    description: 'lists scripts and provides the link/description for them! put in genres if you want to filter based on category!',
	execute: async function (msg, args) {
		
		if (args.length > 3) {
			msg.reply('too many tags! keep it to 3 or less!');
			return 
		};
		
		if (args.length == 0) {
			msg.channel.send("enter in tags if you want a select list of scripts! (and to find usable tags, enter !listtags)!");
			return 
		}


		scripts = await db.multiQuery(args); 
		if (typeof scripts === 'string') {
			msg.reply(`${scripts} isn't a registered tag!`);
		};
		

		new ScriptsList(scripts, msg);
	},
};
