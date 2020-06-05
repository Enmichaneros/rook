module.exports = {
	name: 'shadow',
	description: 'Ping!',
	execute(message, args) {

		if (args.length < 1 || isNaN(parseInt(args[0])) ) {
			message.channel.send("Error: Input not valid.");
			return;
		}

		let dice = parseInt(args[0]);
		let results, hit_count, rerolls;
		let exploding = false;


		if (args.length >= 2 && args[1] === "-e"){
			exploding = true;
		}
		
		[ results, hit_count, rerolls ] = roll(dice, exploding);

		
		if (exploding){
			message.channel.send("**Roll:** (" + results + ")\nHits: " + hit_count + " || Rerolls: " + rerolls);

			let totalHits = hit_count;
			dice = rerolls;
			rerolls = 0;

			while (dice > 0){
				[ results, hit_count, rerolls ] = roll(dice, exploding);
				message.channel.send("**Roll:** (" + results + ")\nHits: " + hit_count + " || Rerolls: " + rerolls);
				totalHits += hit_count;
				dice = rerolls;
				rerolls = 0;
			}
			message.channel.send("Total Hits: **" + totalHits + "**");
		}
		else {
			message.channel.send("**Roll:** (" + results + ")\nHits: " + hit_count);
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