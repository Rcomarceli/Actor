const { Script } = require('../dbObjects');


module.exports = {
	name: 'debug',
	description: 'checks for scripts with no descriptions in the gdrive',
	execute: async function (msg, args) {
        const scriptNames = [];
        const scriptList = await Script.findAll({
            where: {
                description: null
            }
        })

        msg.reply('here\'s a list of all scripts with no descriptions!');
        const data = scriptList.map(script => `${script.name}`).join('\n');
        let response = (data || "no scripts with no description!");
		return msg.channel.send(response, { code: true });
	},
};