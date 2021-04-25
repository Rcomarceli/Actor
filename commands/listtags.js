const { Tag } = require('../dbObjects');

module.exports = {
	name: 'listtags',
	aliases: ['listtag', 'listcategories', 'listcategory', 'tags'],
	description: 'shows all searchable categories', 
	execute: async function (msg, args) {



        const tagList = await Tag.findAll({
			order: [
				['name','ASC']
			]
		});

		msg.reply('here\'s a list of all the tags/categories!');
		return msg.channel.send(tagList.map(tag => `${tag.name}`).join('\n'), { code: true });
	},
};

//make a sort function