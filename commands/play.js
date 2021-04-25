module.exports = {
	name: 'play',
	description: 'joins the voice.channel then plays a sound',
	vcOnly: true,
	execute(msg, args) {
        msg.member.voice.channel.join()
            .then(connection => {
                const dispatcher = connection.play(`./sounds/${args[0]}.mp3`);
                dispatcher.on('finish', () => {
                    msg.member.voice.channel.leave();
                    msg.reply("all done!");
                })
            .catch(console.error);
            });

        },
};
