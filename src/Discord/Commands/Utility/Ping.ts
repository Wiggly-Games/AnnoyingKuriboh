import { ApplicationCommand } from "discord.js";
import { ICommand } from "../../Interfaces/IUtilityCommand";
const { SlashCommandBuilder } = require('discord.js');

export const data : ICommand = {
	Data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async Execute(interaction) {
		await interaction.reply('Pong!');
	},
};