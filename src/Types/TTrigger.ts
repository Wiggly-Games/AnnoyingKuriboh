// Represents a trigger. 
// This has a word/phrase to listen for, and optionally extra text to append at the end of the generated response.
export type TTrigger = {
    TriggerWord: string;
    ExtraText: string;
}