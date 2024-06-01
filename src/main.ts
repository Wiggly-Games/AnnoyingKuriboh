import { MarkovChain } from "@wiggly-games/markov-chains"
import { Server } from "./Server";
import { WriteLog, SetOutputPath } from "@wiggly-games/logs";
import * as TrainingData from "../TestData/WeirdAl.json"
import { Discord } from "./Discord";
import { GetDataSet, Utilities, Paths, Initialize as InitializePaths } from "./Helpers";
import { IChainUser } from "./Interfaces";
import { Database } from "./Database";
require('dotenv').config();

const users: IChainUser[] = [
  Server,
  Discord
];

(async () => {
  await InitializePaths();
  SetOutputPath(Paths.Logs);

  const chain = new MarkovChain();
  const database = new Database(Paths.Database);
  const utilities = new Utilities(chain, database);

  await WriteLog("Main", "Training Chain");
  await chain.Train(TrainingData.join("\n"), GetDataSet("WeirdAl"));
  
  await WriteLog("Main", "Setting up chain users");
  await Promise.all(users.map(x => x.Initialize(utilities)));
})();
