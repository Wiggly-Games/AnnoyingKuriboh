/*
    Interface for the Database, used to store configuration data for servers/users.
*/

import { TDataConfig, TDiscordId } from "../Types";

export interface IDatabase {
    GetTriggerWords(serverId: TDiscordId): Promise<string[]>;
    GetConfiguration(sourceIds): Promise<TDataConfig[]>;

    AddTriggerWord(sourceId: TDiscordId, word: string): Promise<void>;
    RemoveTriggerWord(sourceId: TDiscordId, word: string): Promise<boolean>;
    ChangeDataSet(sourceId: TDiscordId, dataset: string): Promise<void>;
    SetCooldown(sourceId: TDiscordId, cooldown: number): Promise<void>;

    Disconnect(): Promise<void>;
    Initialize(): Promise<void>;
}