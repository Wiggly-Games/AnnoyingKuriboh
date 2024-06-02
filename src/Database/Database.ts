/*
    Implements the database, allowing us to store configuration data.
*/

import {Knex, default as Connect} from "knex";
import { IDatabase } from "../Interfaces/IDatabase";
import { Defaults } from "../Configuration.json";
import { TCooldown, TTrigger } from "../Types";

export class Database implements IDatabase {
    _database: Knex;
    constructor(path: string){
        const knex = Connect({
            client: 'better-sqlite3', // or 'better-sqlite3'
            connection: {
                filename: path + "/Database.db",
            },
            useNullAsDefault: true
        });
        this._database = knex;
    }

    // Disconnects from the database, cleaning up memory use.
    // The database should never be used again after this is called (a new one should be connected instead).
    async Disconnect(): Promise<void> {
        await this._database.destroy();
    }

    // Retrieves all Trigger Words for a server.
    async GetTriggerWords(serverId: string): Promise<TTrigger[]> {
        const response = await this._database("TriggerWords").select(["TriggerWord", "ExtraText"]).where("SourceId", serverId);
        return response.map(data => {
            return {
                TriggerWord: data.TriggerWord,
                ExtraText: data.ExtraText
            }
        });
    }

    // Retrieves the Configuration (DataSet, Cooldown) for a server/user.
    async GetCooldown(serverId: string): Promise<TCooldown> {
        const response = await this._database("Cooldowns").where("ServerId", serverId);
        const hasData = response.length > 0;
        const lastMessageTimestamp = hasData ? response[0].LastMessage : 0;
        const cooldown = hasData ? response[0].Cooldown : Defaults.Cooldown;

        return {
            LastMessageTimestamp: lastMessageTimestamp,
            Cooldown: cooldown
        }
    }

    // Retrieves the Data Set that a user is using.
    async GetDataSet(userId: string): Promise<string> {
        const response = await this._database("DataSets").where("UserId", userId);
        return response.length === 0 ? Defaults.DataSet : response[0].DataSet;
    }

    // Adds a new trigger word to a server.
    async AddTriggerWord(sourceId: string, trigger: TTrigger): Promise<void> {
        await this._database("TriggerWords").insert({
            SourceId: sourceId,
            TriggerWord: trigger.TriggerWord,
            ExtraText: trigger.ExtraText
        });
    }

    // Removes a trigger word from a server.
    async RemoveTriggerWord(sourceId: string, word: string): Promise<boolean> {
        const numAffectedRows = await this._database("TriggerWords").where({
            SourceId: sourceId,
            TriggerWord: word
        }).del();
        return numAffectedRows !== 0;
    }

    // Changes the active data set being used by a server/user.
    async ChangeDataSet(userId: string, dataset: string): Promise<any> {
        await this._database("DataSets").insert({
            UserId: userId,
            DataSet: dataset
        }).onConflict("UserId").merge();
    }

    // Changes the cooldown for a user/server.
    async SetCooldown(serverId: string, cooldown: number): Promise<void> {
        await this._database("Cooldowns").insert({
            ServerId: serverId,
            Cooldown: cooldown
        }).onConflict("ServerId").merge();
    }

    // Updates the time that a message was last sent to the server.
    async SetLastMessageTimestamp(serverId: string, time: number): Promise<void> {
        await this._database("Cooldowns").insert({
            ServerId: serverId,
            LastMessage: time
        }).onConflict("ServerId").merge();
    }

    // Initializes the database, creating any tables that are needed.
    async Initialize(){
        await this.CreateTableIfNotExists("TriggerWords", (table) => {
            table.string("SourceId");
            table.string("TriggerWord");
            table.string("ExtraText");
            table.primary(["SourceId", "TriggerWord"]);
        });
        await this.CreateTableIfNotExists("Cooldowns", (table) => {
            table.string("ServerId").primary();
            table.integer("Cooldown").defaultTo(Defaults.Cooldown);
            table.integer("LastMessage").defaultTo(0);
        });
        await this.CreateTableIfNotExists("DataSets", (table) => {
            table.string("UserId").primary();
            table.string("DataSet").defaultTo(Defaults.DataSet);
        });
    }

    // Creates a table if it doesn't already exist.
    private async CreateTableIfNotExists(tableName: string, configure: (table: Knex.TableBuilder)=>any): Promise<void> {
        const hasTable = await this._database.schema.hasTable(tableName);
        if (hasTable) {
            return;
        }

        return await this._database.schema.createTable(tableName, configure);
    }
}