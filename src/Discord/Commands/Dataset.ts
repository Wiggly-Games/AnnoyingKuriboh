/*
    Updates server configuration for Discord:
        - Cooldown between when it will send messages
        - Data set that commands get generated from
*/

import { ApplicationCommandOptionType } from "discord.js";

module.exports = {
    Private: true,
    Active: true,
	Definition: {
		name: 'dataset',
		description: 'Changes the data set used to generate responses.',
		"integration_types": [ 0, 1 ],
		"contexts": [ 0, 1, 2 ],
        "options": [
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
                    },
                    {
                        name: "Combined",
                        value: "Combined"
                    }
                ]
            }
        ]
	},
	async Execute(interaction, { Database }) {
        const userId = interaction.user.id;
        const dataSetName = interaction.options.getString("name");
    
        await Database.ChangeDataSet(userId, dataSetName);
        interaction.editReply(`You are now generating responses from the ${dataSetName} data set.`);
	}
}