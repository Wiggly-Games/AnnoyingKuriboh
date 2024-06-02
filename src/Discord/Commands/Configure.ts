/*
    Updates server configuration for Discord:
        - Cooldown between when it will send messages
        - Data set that commands get generated from
*/

import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { IUtilities } from "../../Interfaces";
import { MinCooldown } from "../../Configuration.json"

// Sets the cooldown used in the server.
async function SetCooldown(interaction, utilities: IUtilities) {
    const guildId = interaction.guildId;
    const cooldown = interaction.options.getNumber("seconds");

    console.log(`Set ${guildId} cooldown to ${cooldown}`);
    await utilities.Database.SetCooldown(guildId, cooldown);

    interaction.editReply(`Server cooldown has been updated to ${cooldown} seconds.`)
}

// Sets the Data Set used by a user.
async function SetDataSet(interaction, utilities: IUtilities) {
    const userId = interaction.user.id;
    const dataSetName = interaction.options.getString("name");

    console.log(`Set ${userId} data set to ${dataSetName}`);
    await utilities.Database.ChangeDataSet(userId, dataSetName);

    interaction.editReply(`You are now generating responses from the ${dataSetName} data set.`);
}

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
                "default_member_permissions": 0,
                "integration_types": [ 0 ],
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
	async Execute(interaction, utilities: IUtilities) {
		await interaction.deferReply({ephemeral: true});
        switch (interaction.options.getSubcommand()) {
            case "dataset":
                return SetDataSet(interaction, utilities);
            case "cooldown":
                return SetCooldown(interaction, utilities);
        }
	}
}