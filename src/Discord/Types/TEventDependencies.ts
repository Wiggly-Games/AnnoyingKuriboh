import { Client } from "discord.js";
import { TDependencyInjections } from "../../Types";
import { ICommandsQueue } from "../Interfaces";

export type TEventDependencies = TDependencyInjections & {
    CommandsQueue: ICommandsQueue;
    LogName: string;
    Client: Client;
}