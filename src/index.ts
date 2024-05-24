import { MarkovChain } from "@wiggly-games/markov-chains"
import { IChainUser } from "../interfaces";
import { Server } from "./Server";
import { WriteLog, SetOutputPath } from "@wiggly-games/logs";
import * as TrainingData from "../TestData/WeirdAl.json"
import { CreateDirectory } from "@wiggly-games/files";
import { Discord } from "./Discord";
require('dotenv').config()

const users : IChainUser[] = [
  Server,
  Discord
]

const pathToMain = require.main.path;
const ROOT = pathToMain.substring(0, pathToMain.lastIndexOf("\\"));

const Logs = `${ROOT}\\Logs`;
const Static = `${ROOT}\\Static`;
const Data = `${ROOT}\\Data`;

(async () => {
  await CreateDirectory(Static);
  await CreateDirectory(Data);
  await CreateDirectory(Logs);
  SetOutputPath(Logs);
  
  const chain = new MarkovChain(ROOT + "\\Static\\Data");
  await WriteLog("Main", "Training Chain");
  await chain.Train(TrainingData.join("\n"));
  
  await WriteLog("Main", "Setting up chain users");
  await Promise.all(users.map(x => x.Initialize(chain)));
})();
