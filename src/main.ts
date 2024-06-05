import { MarkovChain } from "@wiggly-games/markov-chains"
import { Server } from "./Server";
import { SetOutputPath } from "@wiggly-games/logs";
import { Discord } from "./Discord";
import { GetDataSet, Paths, Initialize as InitializePaths } from "./Helpers";
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
  await database.Initialize();

  await Promise.all(users.map(x => x.Initialize({ Chain: chain, Database: database })));
})();
