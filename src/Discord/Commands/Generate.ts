import { ApplicationCommand, CommandInteraction } from "discord.js";
import { MarkovChain } from "@wiggly-games/markov-chains";
import { ICommand } from "../Interfaces/IUtilityCommand";
import { GetDataSet } from "../../Helpers";
import { IUtilities } from "../../Interfaces";
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	Private: false,
	Active: true,
	Definition: {
		name: 'generate',
		description: 'Generates a new message.',
		"integration_types": [ 0, 1 ],
		"contexts": [ 0, 1, 2 ]
	},
	async Execute(interaction: CommandInteraction, utilities: IUtilities) {
		const dataset = await utilities.Database.GetDataSet(interaction.user.id);
		const response = await utilities.Chain.Generate(GetDataSet(dataset));
		
		await interaction.editReply(response);
	}
}