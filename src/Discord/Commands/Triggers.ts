/*
    This command is responsible for setting up and removing Trigger Phrases,
    which will activate the bot when a user sends a message containing that phrase.
*/

import { ApplicationCommandOptionType } from "discord.js";
import { IUtilities } from "../../Interfaces";

// Adds a trigger phrase to a server.
async function Add(interaction, utilities: IUtilities) {
    const phrase = interaction.options.getString("phrase");
    const loweredPhrase = phrase.toLowerCase();
    
    try {
        await utilities.Database.AddTriggerWord(interaction.guildId, loweredPhrase);
        await interaction.editReply(`New trigger phrase "${phrase}" added.`)
    } catch {
        await interaction.editReply("Failed to add phrase, it is likely already being listened for.");
    }
}

// Removes a trigger phrase from a server.
async function Remove(interaction, utilities: IUtilities) {
    const phrase = interaction.options.getString("phrase");
    const loweredPhrase = phrase.toLowerCase();
    
    const valid = await utilities.Database.RemoveTriggerWord(interaction.guildId, loweredPhrase);
    await interaction.editReply(valid ? `Trigger phrase "${phrase}" removed` : `Could not find trigger phrase "${phrase}", please double check.`);
}

// Retrieves the list of phrases that the server is listening on, and presents them to the user.
async function Get(interaction, utilities: IUtilities) {
    const phrases = await utilities.Database.GetTriggerWords(interaction.guildId);
    const joined = phrases.map((phrase, index) => `${index + 1}. \`${phrase.replace(/\n/g, "\\n")}\``).join("\n");
    console.log(joined);

    await interaction.editReply("The interactions being listened for in this server are:\n" + joined);
}

module.exports = {
	Definition: {
		name: 'triggers',
		description: 'Updates trigger words or phrases that will generate bot responses.',
		"integration_types": [ 0 ],
		"contexts": [ 0 ],
        "default_member_permissions": 0,
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
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "get",
                description: "Retrieves a list of all phrases that are currently being listened for.",
            }
        ]
	},
	async Execute(interaction, utilities: IUtilities) {
		await interaction.deferReply({ephemeral: true});
        switch (interaction.options.getSubcommand()){
            case "add":
                Add(interaction, utilities);
                break;
            case "remove":
                Remove(interaction, utilities);
                break;
            case "get":
                Get(interaction, utilities);
                break;
        }
	}
}