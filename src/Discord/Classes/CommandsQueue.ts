/*
  Implements the Commands Queue, allowing us to walk through commands one-by-one.
  That way we won't run into issues where too many people are using the bot at the same time.
*/


import { Queue } from "@wiggly-games/data-structures";
import * as Log from "@wiggly-games/logs";
import { ICommandsQueue } from "../Interfaces";

export class CommandsQueue implements ICommandsQueue {
  _commands: Queue<() => Promise<void>>;
  _isProcessing: boolean;

  constructor(){
    this._isProcessing = false;
    this._commands = new Queue<() => Promise<void>>;
  }

  Add(command: () => Promise<void>) {
    this._commands.Add(command);
    if (!this._isProcessing) {
      this.StartProcessing();
    }
  }

  private async StartProcessing(){
    // If we're already processing commands, exit without doing anything
    if (this._isProcessing) {
      return;
    }
    this._isProcessing = true;

    while (this._commands.Any()) {
      // Remove the next command, and wait for it to finish
      const command = this._commands.Remove();
      try {
        await command();
      } catch (e) {
        Log.WriteError("Discord", e.message);
      }
    }

    // At this point we've gone through everything, so we need to set the flag to false
    // That way we can start up the next time we get a command
    this._isProcessing = false;
  }
}