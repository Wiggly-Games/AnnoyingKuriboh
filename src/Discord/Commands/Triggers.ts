import { ApplicationCommand, ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { MarkovChain } from "@wiggly-games/markov-chains";
import { ICommand } from "../Interfaces/IUtilityCommand";
import { GetDataSet } from "../../Helpers";
import { IUtilities } from "../../Interfaces";
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	Definition: {
		name: 'triggers',
		description: 'Updates trigger words or phrases that will generate bot responses.',
		"integration_types": [ 0 ],
		"contexts": [ 0 ],
        "options": [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "add",
                description: "Adds a new phrase to trigger responses from.",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "phrase",
                        description: "Enter a phrase that the bot will look for and respond to.",
                        required: true
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "remove",
                description: "Removes a phrase from the list that the bot is looking for.",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "phrase",
                        description: "The phrase to stop listening on.",
                        required: true
                    }
                ]
            }
        ]
	},
	async Execute(interaction: CommandInteraction, utilities: IUtilities) {
		await interaction.deferReply();
        console.log(interaction);

        await interaction.editReply("I see.");
	}
}