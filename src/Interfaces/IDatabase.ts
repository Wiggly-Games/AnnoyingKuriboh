/*
    Interface for the Database, used to store configuration data for servers/users.
*/

import { TCooldown, TDiscordId } from "../Types";
import { TTrigger } from "../Types/TTrigger";

export interface IDatabase {
    GetTriggerWords(serverId: TDiscordId): Promise<TTrigger[]>;
    GetCooldown(serverId: TDiscordId): Promise<TCooldown>;
    GetDataSet(userId: TDiscordId): Promise<string>;

    AddTriggerWord(sourceId: TDiscordId, trigger: TTrigger): Promise<void>;
    RemoveTriggerWord(sourceId: TDiscordId, word: string): Promise<boolean>;
    ChangeDataSet(sourceId: TDiscordId, dataset: string): Promise<void>;
    SetCooldown(sourceId: TDiscordId, cooldown: number): Promise<void>;
    SetLastMessageTimestamp(serverId: string, time: number): Promise<void>

    Disconnect(): Promise<void>;
    Initialize(): Promise<void>;
}