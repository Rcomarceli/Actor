const db = require('../dbObjects');

// const { Script, Tag } = require('../dbObjects');
module.exports = {
	name: 'random',
	description: 'links a random script from the google drive!',
	execute: async function (msg, args) {
		if (args.length > 3) {
			msg.reply('too many tags! keep it to 3 or less!');
		};

		let scripts;

		if (!args.length) { //simply !args doesn't work b/c args = []
			scripts = await db.randomScript();
		}
		else {
			scripts = await db.multiQuery(args); 

			if (typeof scripts === 'string') {
				msg.reply(`${scripts} isn't a registered tag!`); //if multiQuery finds a bad arg, it returns that bad arg
			}
		}

        i = Math.floor(Math.random() * scripts.length);
        rscript = scripts[i];
		msg.reply(`${rscript.name} (${rscript.webViewLink})`);

	},
};