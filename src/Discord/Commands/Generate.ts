import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";

module.exports = {
	Private: false,
	Active: true,
	Definition: {
		name: 'generate',
		description: 'Generates a new message.',
		"integration_types": [ 0, 1 ],
		"contexts": [ 0, 1, 2 ],
		"options": [
			{
				type: ApplicationCommandOptionType.String,
				name: "phrase",
				description: "Optional starting phrase to use.",
				required: false
			}
		]
	},
	async Execute(interaction, { Database, Chains }) {
		const dataset = await Database.GetDataSet(interaction.user.id);
        const phrase = interaction.options.getString("phrase");
		const response = await Chains.get(dataset).Generate(phrase);
		
		await interaction.editReply(response.join(" "));
	}
}