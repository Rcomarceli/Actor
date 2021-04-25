const gdrive = require('../util/googleDrive');
const Sequelize = require('sequelize');
const { Script } = require('../dbObjects');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'scripts.sqlite',
});

//put models into sequelize for table creation
sequelize.import('../models/Tag');
sequelize.import('../models/Script');
sequelize.import('../models/ScriptTag');

//grab files from gdrive, recreate db based on files, then create categoriesmappings from file descriptions
async function refreshScripts() {
  let files = await gdrive.getFiles();
  console.log(`grabbed ${files.length} files via refresh command!`);

  await sequelize.sync({ force: true }).then(async () => { //force destroys table then recreates file entirely
    await Script.bulkCreate(files, {}).then(() => {
      console.log('db recreated with gdrive files');
    }).catch((err) => {
      console.log('failed to put in scripts');
      console.log(err);
    })
  });

  console.log("now finding scripts");
  let scriptSet = await Script.findAll(); 

  //for loop forces it to be sequential, not breaking it. using "map" or "forEach" has it in parallel, breaking the function
  for (let script of scriptSet) {
    await script.addCategoryViaScript();    // function doesn't seem efficient as it's sequential, will need to remake this
  }
  console.log('done refreshing scripts!');
  return files.length;
};


module.exports = {
	name: 'refresh',
	description: 'refreshes database for scripts (do this after starring new scripts in the drive!)',
	execute: async function (msg, args) {
          let scriptNumber = await refreshScripts();
          msg.author.send(`grabbed ${scriptNumber} files via refresh command!`);
    },
  refreshScripts,
};

