module.exports = {
    name: 'randomperson',
    aliases: ['nemesis', 'rollperson'],
    description: 'picks a random user out of the voice chat list!',
    vcOnly: true,
	execute(msg, args) {
        vcList = msg.member.voice.channel.members;

        vcList.sweep(vcUser => vcUser.user.bot === true); 
        vcUser = vcList.random();

        msg.channel.send(`this round's random person is...${vcUser.displayName}!`);
	},
};