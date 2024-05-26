import { ApplicationCommand } from "discord.js";
import { MarkovChain } from "@wiggly-games/markov-chains";
import { ICommand } from "../../Interfaces/IUtilityCommand";
import { GetStaticData } from "../../../Helpers";
const { SlashCommandBuilder } = require('discord.js');

export function GetCommand(chain: MarkovChain): ICommand {
	return {
		data: {
			name: 'ping',
			description: 'Replies with Pong!',
			"integration_types": [ 0, 1 ],
			"contexts": [ 0, 1, 2 ]
		},			
		async execute(interaction) {
			await interaction.reply(await chain.Generate(GetStaticData()));
		},
	};
}