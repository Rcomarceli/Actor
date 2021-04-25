const { actorCollections, ActorCollection } = require('../util/turnOrder');

module.exports = {
	name: 'blitz',
    description: 'sets a time limit for readying up-- shuffles all users in vc that havent skipped',
    vcOnly: true,
	execute: async function (msg, args) {
        if (!actorCollections.has(msg.guild.id)) {
            actorCollections.set(msg.guild.id, new ActorCollection());
        };

        const guild = actorCollections.get(msg.guild.id);
        const vcList = msg.member.voice.channel.members; 

        let time = +args[0]*1000 || 60000;
        if (time > 1800000) return msg.channel.send('timer exceeds 30 minutes! try a shorter time!');

        let blitzTimer = guild.getBlitzTimer();
        if (blitzTimer) {
            guild.deleteBlitzTimer();
            msg.channel.send('blitz timer cancelled!');
        }
        else {
            // setting timeOut here since we need access to msg.channel.send
            blitzTimer = setTimeout(() => {
                let turnOrderList = guild.blitz(vcList);
                msg.channel.send(turnOrderList); 
            }, time);
            guild.setBlitzTimer(blitzTimer);

            msg.channel.send(`setting blitz timer to ${time/1000} seconds...`)
        };
    },
};

//default is 60 seconds
//+ in front of variable returns numeric representation 