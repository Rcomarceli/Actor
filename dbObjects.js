const Sequelize = require('sequelize'); //calls library
const Discord = require('discord.js'); //used for send and reply in multiQuery

const sequelize = new Sequelize('database', 'username', 'password', { //uses library to connect it to database Script.sqlite
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'scripts.sqlite',
});

const Script = sequelize.import('models/Script'); //import the 3 table models
const Tag = sequelize.import('models/Tag');
const ScriptTag = sequelize.import('models/ScriptTag');

Script.belongsToMany(Tag, {through: ScriptTag, foreignkey: 'script_id' }); //association gives us these methods: Script.getTag(s), setTag(s), createTag(s)
Tag.belongsToMany(Script, {through: ScriptTag, foreignkey: 'tag_id' }); //association gives us: Tag.getScript(s), setScript(s), createScript(s)

//validate tags and return their ids
convertToTagId = async function(args) {
		let arg_ids = [];

		//check if args are registered as tags
		for (i = 0; i < args.length; i++) {
				let tag = await Tag.findOne({ where: { name: {[Sequelize.Op.like]: args[i]} } });
				if (!tag) return args[i];//throw new Error(`${args[i]} isn't registered as a tag!`)
				arg_ids.push(tag.id);
		};
	
		//default values for multiQuery
		arg_ids[1] = arg_ids[1] || 'nothing'; 
		arg_ids[2] = arg_ids[2] || 'nothing'; 
		return arg_ids;
};

//requires at least 1 arg. args[1] and args[2] are [optional]. could support more but why would you sort by 4 things lmao
multiQuery = async function(args) {
	let arg_ids = await convertToTagId(args);
	if (typeof arg_ids === 'string') return arg_ids; //return if an arg isn't a registered tag

	//base query
	let query = `select s.* from (Scripts s INNER JOIN Script_Tags st ON s.id=st.script_id INNER JOIN Tags t ON st.tag_id=t.id AND t.id=${arg_ids[0]})`

	//add inner join if 2nd tag was passed
	if (arg_ids[1] !== "nothing") {
		query = query + ` INNER JOIN (Scripts s1 INNER JOIN Script_Tags st1 ON s1.id=st1.script_id INNER JOIN Tags t1 ON st1.tag_id=t1.id AND t1.id=${arg_ids[1]})  ON s.id = s1.id`
	};

	//add inner join if 3rd tag was passed
	if (arg_ids[2] !== "nothing") {
		query = query + ` INNER JOIN (Scripts s2 INNER JOIN Script_Tags st2 ON s2.id=st2.script_id INNER JOIN Tags t2 ON st2.tag_id=t2.id AND t2.id=${arg_ids[2]})  ON s.id = s2.id`
	};

	//add sort to query
	query = query + ' ORDER BY description ASC'

	let res = sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
	return res;
};

//random function
randomScript = async function() {
	let res = await Script.findAll();
	return res;
};



//if it rebuilds everytime, we don't need to check if its in the table
Script.prototype.addCategoryViaScript = async function() { 
	let targetDescrip = this.description; //expected "category1, Category2, category3"

	if (!targetDescrip) {
		// return console.log(`the script \"${this.name}\" has no description!`);
		targetDescrip = "descriptionNeeded"
	}
	let newDescription = targetDescrip.split(/[ ,]+/).filter(Boolean);; //regex filters based on commas and empty spaces-- empty strings are "falsy", filtered by boolean
	for (let categoryText of newDescription) { 
		let categoryString = categoryText.toLowerCase(); 
		let targetCategory = await Tag.findOne({where: { name: categoryString }});
	
		if (targetCategory) {
			//console.log(`the category \"${targetCategory.name}\" already exists, associating it with the script...`);
			await this.addTag(targetCategory);
		}
		else {
			//console.log(`the category \"${categoryString}\" doesn't exist. creating it and associating it with the script...`);
			await this.createTag({ name: categoryString});
		};
	}

	return
}


module.exports = { Script, Tag, ScriptTag, multiQuery, convertToTagId, randomScript};
