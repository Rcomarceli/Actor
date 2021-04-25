const { actorCollections, ActorCollection } = require('../util/turnOrder');

module.exports = {
	name: 'itstime',
	description: 'decides turn order! (use this if some actors arent participating)!',
	vcOnly: true,
	execute(msg, args) {
        if (!actorCollections.has(msg.guild.id)) {
            actorCollections.set(msg.guild.id, new ActorCollection());
        };
		const guild = actorCollections.get(msg.guild.id);
		
		const vcList = msg.member.voice.channel.members; 
 		const turnOrderList = guild.turnOrder(vcList);
		msg.channel.send(turnOrderList);
	},
};