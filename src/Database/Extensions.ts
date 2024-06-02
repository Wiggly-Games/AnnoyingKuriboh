/*
    Extensions for Knex, providing us with better autocompletes.
*/
declare module 'knex/types/tables' {
    // Trigger Words - These specify a Guild + a single word,
    // We can have multiple rows indicating each word they'll use as a trigger
    interface TriggerWords {
        SourceId: string;
        TriggerWord: string;
        ExtraText: string;
    }

    // Table for storing server -> cooldown time.
    interface Cooldowns {
        ServerId: string;
        Cooldown: number;
        LastMessage: number;
    }

    // Table for storing user -> Data Set.
    interface DataSets {
        UserId: string;
        DataSet: string;
    }

    // The tables we have access to
    interface Tables {
        Cooldowns: Cooldowns;
        DataSets: DataSets;
        TriggerWords: TriggerWords;
    }
}