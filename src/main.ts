import { ChainConfiguration, MarkovChain } from "@wiggly-games/markov-chains"
import { Server } from "./Server";
import { SetOutputPath } from "@wiggly-games/logs";
import { Discord } from "./Discord";
import { GetDataSet, Paths, Initialize as InitializePaths, GetChainPaths } from "./Helpers";
import { IChainUser } from "./Interfaces";
import { Database } from "./Database";
require('dotenv').config();

const users: IChainUser[] = [
  Server,
  Discord
];

// Default chain configuration. May be worth setting up separate configs later,
// but this is fine for now.
const ChainConfig : ChainConfiguration = {
  WordCount: 50,
  Backoff: true,
  MinBackoffLength: 2,
  TrainingLength: 5,
  MinRequiredOptions: 2,
  StopAtFewerOptions: false
}

// Creates the MarkovChains map, mapping from the DataSet name -> Chain.
async function LoadChains(): Promise<Map<string, MarkovChain>> {
  const chainNames = await GetChainPaths();
  const results = new Map<string, MarkovChain>();

  for (const dataset of chainNames) {
    const chain = new MarkovChain(GetDataSet(dataset), ChainConfig);
    await chain.Load();

    results.set(dataset, chain);
  }

  return results;
}

// Main function to run the bot
async function Main(){
  await InitializePaths();
  SetOutputPath(Paths.Logs);

  const chains = await LoadChains();
  
  const database = new Database(Paths.Database);
  await database.Initialize();

  await Promise.all(users.map(x => x.Initialize({ Chains: chains, Database: database })));
}

Main();