/*
    Implements the database, allowing us to store configuration data.
*/

import {Knex, default as Connect} from "knex";
import { IDatabase } from "../Interfaces/IDatabase";
import { Defaults } from "../Configuration.json";
import { TDataConfig } from "../Types/TDataConfig";

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
    async GetTriggerWords(serverId: string): Promise<string[]> {
        const response = await this._database("TriggerWords").select("TriggerWord").where("SourceId", serverId);
        return response.map(data => data.TriggerWord);
    }

    // Retrieves the Configuration (DataSet, Cooldown) for a server/user.
    async GetConfiguration(sourceIds: string[]): Promise<TDataConfig[]> {
        return await this._database("Configuration").whereIn("SourceId", sourceIds);
    }

    // Adds a new trigger word to a server.
    async AddTriggerWord(sourceId: string, word: string): Promise<void> {
        await this._database("TriggerWords").insert({
            SourceId: sourceId,
            TriggerWord: word
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
    async ChangeDataSet(sourceId: string, dataset: string): Promise<any> {
        await this._database("Configuration").insert({
            SourceId: sourceId,
            DataSet: dataset
        }).onConflict("SourceId").merge();
    }

    // Changes the cooldown for a user/server.
    async SetCooldown(sourceId: string, cooldown: number): Promise<void> {
        await this._database("Configuration").insert({
            SourceId: sourceId,
            Cooldown: cooldown
        }).onConflict("SourceId").merge();
    }

    // Initializes the database, creating any tables that are needed.
    async Initialize(){
        // Create the Trigger Words table
        await this.CreateTableIfNotExists("TriggerWords", (table) => {
            table.string("SourceId");
            table.string("TriggerWord");
            table.primary(["SourceId", "TriggerWord"]);
        });

        // Create the Configuration table
        await this.CreateTableIfNotExists("Configuration", (table) => {
            table.string("SourceId").primary();
            table.string("DataSet").defaultTo(Defaults.DataSet);
            table.integer("Cooldown").defaultTo(Defaults.Cooldown);
        });
    }

    // Creates a table if it doesn't already exist.
    private async CreateTableIfNotExists(tableName: string, configure: (table: Knex.TableBuilder)=>any): Promise<void> {
        const hasTable = this._database.schema.hasTable(tableName);
        if (hasTable) {
            return;
        }

        return await this._database.schema.createTable(tableName, configure);
    }
}