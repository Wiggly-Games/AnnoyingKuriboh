/*
    Queue for upcoming commands.
*/

export interface ICommandsQueue {
    Add(command: () => Promise<void>): void;
}