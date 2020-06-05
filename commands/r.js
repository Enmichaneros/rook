module.exports = {
	name: 'r',
	description: 'Roll the dice (probably)',
	execute(message, args) {
		message.channel.send('Result: 1d20 (**20**)\n***Critical Hit!***');
	},
};