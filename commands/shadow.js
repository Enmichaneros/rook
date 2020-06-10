module.exports = {
	name: 'shadow',
	description: 'Simple dice roller for Shadowrun.',
	execute(message, args) {

		if (args.length < 1 || isNaN(parseInt(args[0])) ) {
			message.channel.send("Error: Input not valid.");
			return;
		}
		let dice = parseInt(args.shift());
		let results, hit_count, rerolls;
		let exploding = false;
		let desc = ""; // description of roll

		while (args.length > 0) {
			arg = args.shift();
			if (arg === "-e"){
				exploding = true;
			}
			else {
				if (desc){
					desc += " ";
				}
				desc += arg;
			}
		}

		

		reply = (desc ? "**" + desc + ":** " : "**Roll:** ");

		[ results, hit_count, rerolls ] = roll(dice, exploding);
	
		if (exploding){
			reply += "(" + results + ")\nHits: " + hit_count + " | Rerolls: " + rerolls;

			message.channel.send(reply);

			let totalHits = hit_count;
			dice = rerolls;
			rerolls = 0;

			while (dice > 0){
				[ results, hit_count, rerolls ] = roll(dice, exploding);
				reply = "**Roll:** (" + results + ")\nHits: " + hit_count + " | Rerolls: " + rerolls;
				message.channel.send(reply);
				totalHits += hit_count;
				dice = rerolls;
				rerolls = 0;
			}
			message.channel.send("**Total Hits:** " + totalHits);
		}
		else {
			reply += "("+ results + ")\n**Hits:** " + hit_count;
			message.channel.send(reply);
		}
	},
};

function roll(dice, exploding){
	let results = "";
	let hit_count = 0;
	let rerolls = 0; // keeping track of exploding dice

	for (let i = 0; i < dice; i++){
		let roll = Math.floor(Math.random() * 6) + 1;
		switch (roll){
			case 6:
				hit_count++;
				if (exploding){
					results += "__**" + roll + "**__";
					rerolls++;
				}
				else{
					results += "**" + roll + "**";
				}
				break;
			case 5:
				hit_count++;
				results += "**" + roll + "**";
				break;
			default:
				results += roll;
				break;
		}
		if (i < dice - 1) {
			results += ", ";
		}
	}
	return [results, hit_count, rerolls];
}