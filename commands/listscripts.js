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
			scripts = await db.Script.findAll();
			return new ScriptsList(scripts, msg);
		}


		scripts = await db.multiQuery(args); 
		if (typeof scripts === 'string') {
			msg.reply(`${scripts} isn't a registered tag!`);
		};
		

		new ScriptsList(scripts, msg);
	},
};
