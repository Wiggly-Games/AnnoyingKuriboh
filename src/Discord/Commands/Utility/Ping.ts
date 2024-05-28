import { ApplicationCommand, CommandInteraction } from "discord.js";
import { MarkovChain } from "@wiggly-games/markov-chains";
import { ICommand } from "../../Interfaces/IUtilityCommand";
import { GetStaticData } from "../../../Helpers";
import { IUtilities } from "../../../Interfaces";
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	Definition: {
		name: 'ping',
		description: 'Says hello with a message.',
		"integration_types": [ 0, 1 ],
		"contexts": [ 0, 1, 2 ]
	},
	async Execute(interaction: CommandInteraction, utilities: IUtilities) {
		await interaction.deferReply();

		const response = await utilities.Chain.Generate(GetStaticData());
		await interaction.editReply(response);
	}
}