const fs = require('fs'); // Node file system

const { prefix, token } = require('./config.json');
const {log_channel_id, avrae_id, tracked_channels } = require('./ids.json');

const Discord = require('discord.js');
const client = new Discord.Client();


// retrieving command behavior from /commands folder
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
	
});

client.login(token).catch(console.error);

client.on('message', message => {

	// If Avrae posted a message an in approved channel 
	if (tracked_channels.includes(message.channel.id) && message.author.id === avrae_id){
		client.channels.fetch(log_channel_id)
		.then( channel => {
			let embed;
			// If it's an embed roll, use that; else, create a new one
			if (message.embeds.length != 0){
				originalEmbed = new Discord.MessageEmbed(message.embeds[0]);
				embed = originalEmbed.setTimestamp()
					.setAuthor("Avrae - Linked")
					.addFields(
						{ name: 'Channel', value: message.channel.name }
					);
			}
			else {
				embed = new Discord.MessageEmbed()
					.setTimestamp()
					.setColor('#0099ff')
					.setAuthor('Avrae - Manual')
					.setDescription(message.content)
					.addFields(
						{ name: 'Channel', value: message.channel.name }
					);
			}
			channel.send(embed);
			return; // don't do anything else with the message
		})
		.catch(console.error);
	}

	// if this doesn't start with the prefix, then return 
	// not relevant, since we're tracking *all* messages.
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// arguments for commands (only relevant if using commands)
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	let reply; // reply message

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
	
});// end client.on
