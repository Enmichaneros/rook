module.exports = {
	name: 'shadow',
	description: 'Simple dice roller for Shadowrun.',
	execute(message, args) {
		message.delete().catch( _ =>{}); 


		if (args.length < 1) {
			message.channel.send("Error: No arguments specified.");
			return;
		}
		if (isNaN(parseInt(args[0]))){
			message.channel.send("Error: Did not specify an amount to roll.");
			return;
		}

		let Parser = require('expr-eval').Parser;
		let parser = new Parser();
		let parsing = true;
		let expression = "";


		let current;
		let prev;

		// use expr-eval
		while (args.length > 0 && parsing){
			current = args.shift();
			console.log("current argument: " + current);

			// if prev is an operator, it must be followed by a number else it's an invalid expression
			if (prev === "+" || prev === "-"){
				if (isNaN(parseInt(current))){
					message.channel.send("Error: Invalid expression.");
					return;
				}
			}
			// if prev is a number and not followed by an operator, then we're done parsing
			else if (!isNaN(parseInt(prev))){
				if (current != "+" && current != "-"){
					parsing = false;
					args.unshift(current);
					break;
				}
			}
			// add the current character to the expression to parse
			expression += current;
			prev = current;
		}

		console.log("evaluating expression: " + expression);
		let exp = parser.parse(expression);
		let dice = exp.evaluate();

		let results, hit_count, rerolls;
		let exploding = false;
		let desc = ""; // description of roll

		while (args.length > 0) {
			// math parsing
			current = args.shift();

			if (current === "-e"){
				exploding = true;
			}
			else {
				if (desc){
					desc += " ";
				}
				desc += current;
			}
		}

		let reply = "<@" + message.author.id + ">\n";
		reply += (desc ? "**" + desc + "** " : "**Roll** ");
		reply += "(" + expression + "=" + dice + " rolls): ";

		[ results, hit_count, rerolls ] = roll(dice, exploding);
	
		if (exploding){
			reply += "(" + results + ")\nHits: " + hit_count + " | Rerolls: " + rerolls;

			message.channel.send("\n" + reply);

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