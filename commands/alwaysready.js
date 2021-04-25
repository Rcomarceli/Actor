const { actorCollections, ActorCollection } = require('../util/turnOrder');

module.exports = {
    name: 'alwaysready',
    aliases: ['always'],
    description: 'readies you up always (until the bot restarts)',
	vcOnly: true,
	execute(msg, args) {
        if (!actorCollections.has(msg.guild.id)) {
            actorCollections.set(msg.guild.id, new ActorCollection());
        };
        const guild = actorCollections.get(msg.guild.id);
        const vcList = msg.member.voice.channel.members; 
        
        const isMemberAlwaysReady = guild.toggleAlwaysReady(msg.member);
        isMemberAlwaysReady ? msg.reply("you're always ready now! (to cancel, enter in the command again)") : msg.reply("you're no longer always ready!");


        //check if all members are set to "always ready"
        const allReady = guild.isEveryoneAlwaysReady(vcList);
        if (allReady) msg.channel.send("to decide turn order when everyone is set to 'always ready', use !itstime");
        
        //perform a ready check in case last person used alwaysready
        const isTime = guild.readyCheck(vcList);
        if (isTime) {
            const turnOrderList = guild.turnOrder(vcList);
            msg.channel.send(turnOrderList);
        }
	},
};
