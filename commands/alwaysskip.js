const { actorCollections, ActorCollection } = require('../util/turnOrder');

module.exports = {
    name: 'alwaysskip',
    aliases: ['alwayskip', 'observer'],
    description: 'always skips your turn (use if just listening)',
    vcOnly: true,
	execute(msg, args) {
        if (!actorCollections.has(msg.guild.id)) {
            actorCollections.set(msg.guild.id, new ActorCollection());
        };
        const guild = actorCollections.get(msg.guild.id);
        const vcList = msg.member.voice.channel.members; 

        const isMemberAlwaysSkipping = guild.toggleAlwaysSkip(msg.member);
        isMemberAlwaysSkipping ? msg.reply("skipping you each turn now! (to cancel, enter in the command again)") : msg.reply("no longer always skipping you!");

        //perform a ready check in case last person used alwaysSkip
        const isTime = guild.readyCheck(vcList);
        if (isTime) {
            const turnOrderList = guild.turnOrder(vcList);
            msg.channel.send(turnOrderList);
        }
	},
};