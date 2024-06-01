import { TDataConfig } from "../Types";

/*
    Extensions for Knex, providing us with better autocompletes.
*/
declare module 'knex/types/tables' {
    // Trigger Words - These specify a Guild + a single word,
    // We can have multiple rows indicating each word they'll use as a trigger
    interface TriggerWords {
        SourceId: string;
        TriggerWord: string;
    }

    // The tables we have access to
    interface Tables {
        Configuration: TDataConfig;
        TriggerWords: TriggerWords;
    }
}