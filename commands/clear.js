const { actorCollections } = require('../util/turnOrder');

module.exports = {
	name: 'clear',
	description: 'clears the ready list',
	vcOnly: true,
	execute(msg, args) {
		let guild = actorCollections.get(msg.guild.id);
		
        if (guild) {
			const vcList = msg.member.voice.channel.members;
			guild.clear(vcList);
		}
		msg.channel.send('cleared!');
	},
};