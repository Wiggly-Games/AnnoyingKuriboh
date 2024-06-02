/*
    Deploys the Discord bot commands, so that we'll see the latest on Discord.
*/

import { DeployCommands } from "./Discord/Discord";
require('dotenv').config();

(async () => {
    await DeployCommands();
})();