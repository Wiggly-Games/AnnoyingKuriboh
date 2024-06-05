/*
    training script. This will take all the json files under TrainingData,
    train the Markov Chain against them, and store the results where the
    bot can access them later.
*/

import { MarkovChain } from "@wiggly-games/markov-chains"
import * as Files from "@wiggly-games/files"
import { Paths, Initialize as InitializePaths, GetDataSet } from "./Helpers";

const TRAINING_DATA = "../TrainingData";

async function CreateTrainingSet(path: string, data: string[], chain: MarkovChain): Promise<string[]> {
    Files.CreateDirectory(path);
    await chain.Train(data.join("\n"), path);

    // Return the data to the calling method
    return data;
}

(async () => {
    const chain = new MarkovChain();

    await InitializePaths();

    const trainingFiles = await Files.GetDescendants(TRAINING_DATA, (file) => file.endsWith(".json"));
    let combinedData = [ ];

    for (const file of trainingFiles) {
        const filename = Files.GetFileName(file);
        const pathToTrainingSet = GetDataSet(filename);
        const data = await Files.LoadJson(file);

        let newData = await CreateTrainingSet(pathToTrainingSet, data, chain);
        combinedData = combinedData.concat(newData);
    }

    // Create a combined copy of all the data
    await CreateTrainingSet(GetDataSet("Combined"), combinedData, chain);
})();
