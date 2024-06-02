/*
    Updates server configuration for Discord:
        - Cooldown between when it will send messages
        - Data set that commands get generated from
*/

import { ApplicationCommandOptionType } from "discord.js";
import { IUtilities } from "../../Interfaces";

module.exports = {
    Private: true,
    Active: false,
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
                    }
                ]
            }
        ]
	},
	async Execute(interaction, utilities: IUtilities) {
        const userId = interaction.user.id;
        const dataSetName = interaction.options.getString("name");
    
        await utilities.Database.ChangeDataSet(userId, dataSetName);
    
        interaction.editReply(`You are now generating responses from the ${dataSetName} data set.`);
	}
}