const { actorCollections } = require('../util/turnOrder');

module.exports = {
	name: 'readylist',
	description: 'displays everyone thats currently ready to voice act',
	execute(msg, args) {
		if (!actorCollections.has(msg.guild.id)) return msg.reply('no currently ready actors in the list!');
		
		const guild = actorCollections.get(msg.guild.id);
		const readyActors = guild.readyList();

		if (readyActors.length) {
			return msg.channel.send(`people who have readied up so far (note: this is not the turn order list):\ \r\n${readyActors.join('\r\n')}`);	
		}
		return msg.reply('no currently ready actors in the list!');
	},
};