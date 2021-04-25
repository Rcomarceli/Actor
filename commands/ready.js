const { actorCollections, ActorCollection } = require('../util/turnOrder');

module.exports = {
    name: 'ready',
    description: 'adds you to the "ready list". decides turn order if everyone in the voice channel is ready!',
    vcOnly: true,
    execute(msg, args) {
        if (!actorCollections.has(msg.guild.id)) {
            actorCollections.set(msg.guild.id, new ActorCollection());
        };
        const guild = actorCollections.get(msg.guild.id);
        
        const isMemberReady = guild.toggleReady(msg.member);
        isMemberReady ? msg.channel.send('added!') : msg.reply('removed you from the ready list!');

        //check if all vc users are ready 
        const vcList = msg.member.voice.channel.members; 
        const isTime = guild.readyCheck(vcList);
        if (isTime) {
            const turnOrderList = guild.turnOrder(vcList);
            msg.channel.send(turnOrderList);
        };
    },
};

