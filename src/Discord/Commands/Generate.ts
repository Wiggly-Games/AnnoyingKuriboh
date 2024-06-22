import { CommandInteraction } from "discord.js";

module.exports = {
	Private: false,
	Active: true,
	Definition: {
		name: 'generate',
		description: 'Generates a new message.',
		"integration_types": [ 0, 1 ],
		"contexts": [ 0, 1, 2 ]
	},
	async Execute(interaction: CommandInteraction, { Database, Chains }) {
		const dataset = await Database.GetDataSet(interaction.user.id);
		const response = await Chains.get(dataset).Generate();
		
		await interaction.editReply(response.join(" "));
	}
}