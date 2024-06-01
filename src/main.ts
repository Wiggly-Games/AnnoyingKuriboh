import { MarkovChain } from "@wiggly-games/markov-chains"
import { Server } from "./Server";
import { WriteLog, SetOutputPath } from "@wiggly-games/logs";
import * as TrainingData from "../TestData/WeirdAl.json"
import { CreateDirectory, ROOT } from "@wiggly-games/files";
import { Discord } from "./Discord";
import { GetStaticData, Utilities } from "./Helpers";
import { IChainUser } from "./Interfaces";
require('dotenv').config()

const users : IChainUser[] = [
  Server,
  Discord
]

const Logs = `${ROOT}\\Logs`;
const Static = `${ROOT}\\Static`;
const Data = `${ROOT}\\Data`;

(async () => {
  await CreateDirectory(Static);
  await CreateDirectory(Data);
  await CreateDirectory(Logs);
  SetOutputPath(Logs);

  const chain = new MarkovChain();
  const utilities = new Utilities(chain);

  await WriteLog("Main", "Training Chain");
  await chain.Train(TrainingData.join("\n"), GetStaticData("WeirdAl"));
  
  await WriteLog("Main", "Setting up chain users");
  await Promise.all(users.map(x => x.Initialize(utilities)));
})();
