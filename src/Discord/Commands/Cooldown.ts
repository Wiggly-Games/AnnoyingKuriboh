/*
    Updates server configuration for Discord:
        - Cooldown between when it will send messages
        - Data set that commands get generated from
*/

import { ApplicationCommandOptionType } from "discord.js";
import { MinCooldown } from "../../Configuration.json"

module.exports = {
    Private: true,
    Active: true,
	Definition: {
		name: 'cooldown',
		description: 'Sets how long the cooldown should be between the bot generating responses.',
		"integration_types": [ 0 ],
		"contexts": [ 0 ],
        "default_member_permissions": 0,
        "options": [
            {
                type: ApplicationCommandOptionType.Number,
                name: "seconds",
                description: "The number of seconds to wait before the bot can generate another response.",
                required: true,
                min_value: MinCooldown
            }
        ]
	},
	async Execute(interaction, { Database }) {
        const guildId = interaction.guildId;
        const cooldown = interaction.options.getNumber("seconds");
    
        await Database.SetCooldown(guildId, cooldown);
        interaction.editReply(`Server cooldown has been updated to ${cooldown} seconds.`)
	}
}
