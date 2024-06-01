import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { GetDataSet } from "../../Helpers";
import { IUtilities } from "../../Interfaces";
const { SlashCommandBuilder } = require('discord.js');
import { MinCooldown } from "../../Configuration.json"

module.exports = {
	Definition: {
		name: 'configure',
		description: 'Configures the Annoying Kuriboh bot.',
		"integration_types": [ 0, 1 ],
		"contexts": [ 0, 1, 2 ],
        "options": [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "dataset",
                description: "Changes the data set used to generate responses.",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "name",
                        description: "The name of the data set to generate responses from.",
                        required: true,
                        choices: [
                            {
                                name: "WeirdAl",
                                value: "WeirdAl"
                            },
                            {
                                name: "Wiggles",
                                value: "Wiggles"
                            }
                        ]
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "cooldown",
                description: "Sets how long the cooldown should be between the bot generating responses.",
                options: [
                    {
                        type: ApplicationCommandOptionType.Number,
                        name: "seconds",
                        description: "The number of seconds to wait before the bot can generate another response.",
                        required: true,
                        min_value: MinCooldown
                    }
                ]
            }
        ]
	},
	async Execute(interaction: CommandInteraction, utilities: IUtilities) {
		await interaction.deferReply();

        await interaction.editReply("Ah, I see you.");
        console.log(interaction);
	}
}