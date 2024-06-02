/*
    Interface for the Database, used to store configuration data for servers/users.
*/

import { TDiscordId } from "../Types";
import { TTrigger } from "../Types/TTrigger";

export interface IDatabase {
    GetTriggerWords(serverId: TDiscordId): Promise<TTrigger[]>;
    GetCooldown(serverId: TDiscordId): Promise<number>;
    GetDataSet(userId: TDiscordId): Promise<string>;
    GetMessageTime(serverId: string): Promise<number>;

    AddTriggerWord(sourceId: TDiscordId, trigger: TTrigger): Promise<void>;
    RemoveTriggerWord(sourceId: TDiscordId, word: string): Promise<boolean>;
    ChangeDataSet(sourceId: TDiscordId, dataset: string): Promise<void>;
    SetCooldown(sourceId: TDiscordId, cooldown: number): Promise<void>;
    SetMessageTime(serverId: string, time: number): Promise<void>

    Disconnect(): Promise<void>;
    Initialize(): Promise<void>;
}