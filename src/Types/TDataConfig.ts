// Defines Data Configuration for a Discord Server,
// Which is used to define Cooldown + Source Data Set.
export type TDataConfig = {
    SourceId: string;
    Cooldown: number;
    DataSet: string;
}