const { actorCollections, ActorCollection } = require('../util/turnOrder');

module.exports = {
	name: 'roles',
    description: 'decides roles for everyone!',
    vcOnly: true,
	execute: async function (msg, args) {
        if (!actorCollections.has(msg.guild.id)) {
            actorCollections.set(msg.guild.id, new ActorCollection());
        };

        const guild = actorCollections.get(msg.guild.id);
        const vcList = msg.member.voice.channel.members; 
        //+ in front of variable returns numeric representation 
        let additionalPeople = +args[0];
        if (additionalPeople > 10) return msg.channel.send('choose less than 10 additional people!');
        turnOrderList = guild.roles(vcList, additionalPeople); //upon next ready, turnOrder will simply reprint the same list

        msg.channel.send(turnOrderList);
	},
};


