import { Queue } from "@wiggly-games/data-structures";
import * as Log from "@wiggly-games/logs";

const commandsQueue = new Queue<() => Promise<void>>;
let isProcessingCommands: boolean = false;


// Runs commands from the CommandsQueue.
async function RunCommands(){
    // If we're already processing commands, exit without doing anything
    if (isProcessingCommands) {
      return;
    }
    isProcessingCommands = true;
    
    while (commandsQueue.Any()) {
      // Remove the next command, and wait for it to finish
      const command = commandsQueue.Remove();
      try {
        await command();
      } catch (e) {
        Log.WriteError("Discord", e.message);
      }
    }
  
    // At this point all the commands are gone, so we're doing processing
    isProcessingCommands = false;
  }
  
  // Adds a command to the queue. Starts up a process to run through every command if there's none currently running. 
  export async function Add(command: ()=>Promise<void>): Promise<void> {
    commandsQueue.Add(command);
  
    // If there's nothing running, start running the command
    if (!isProcessingCommands) {
      RunCommands();
    }
  }
  