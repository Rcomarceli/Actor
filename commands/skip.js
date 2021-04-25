const { actorCollections, ActorCollection } = require('../util/turnOrder');

module.exports = {
    name: 'skip',
    aliases: ['pass'],
    description: 'skips your turn this round!',
    vcOnly: true,
    execute(msg, args) {
        if (!actorCollections.has(msg.guild.id)) {
            actorCollections.set(msg.guild.id, new ActorCollection());
        };
        const guild = actorCollections.get(msg.guild.id);

        const isSkipping = guild.toggleSkip(msg.member);
        isSkipping ? msg.reply('skipping your turn!') : msg.reply('unskipping you!');

        //check if all vc users are ready 
        const vcList = msg.member.voice.channel.members; 
        const isTime = guild.readyCheck(vcList);
        if (isTime) {
            const turnOrderList = guild.turnOrder(vcList);
            msg.channel.send(turnOrderList);
        };
    },
};