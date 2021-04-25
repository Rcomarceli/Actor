module.exports = {
	name: 'roll',
	description: 'RNG function, rolls a "x" sided die!',
	execute(msg, args) {
        if (Number(args[0])) { //checks if first argument is a number
            i = Math.floor(Math.random() * Number(args[0])+1); 
            return msg.reply(i + "!");
        }
        else {
            msg.reply("include a number for the sides of the dice!");
        }
    },
};