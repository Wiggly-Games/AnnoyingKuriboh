/*
    training script. This will take all the json files under TrainingData,
    train the Markov Chain against them, and store the results where the
    bot can access them later.
*/

import { ChainConfiguration, MarkovChain } from "@wiggly-games/markov-chains"
import * as Files from "@wiggly-games/files"
import { Paths, Initialize as InitializePaths, GetDataSet } from "./Helpers";

const TRAINING_DATA = "../TrainingData";

async function CreateTrainingSet(path: string, data: string[], settings: ChainConfiguration): Promise<string[]> {
    Files.CreateDirectory(path);

    let chain = new MarkovChain(path, settings);
    await chain.Train(data.join("\n"));
    await chain.Save();

    console.log(`Finished training ${path}`);

    // Return the data to the calling method
    return data;
}

(async () => {
    await InitializePaths();

    const trainingFiles = await Files.GetDescendants(TRAINING_DATA, (file) => file.endsWith(".json"));
    let combinedData = [ ];

    const defaultSettings : ChainConfiguration = {
        WordCount: 50,
        Backoff: true,
        MinBackoffLength: 2,
        TrainingLength: 5,
        MinRequiredOptions: 3,
        StopAtFewerOptions: true
    }

    for (const file of trainingFiles) {
        const filename = Files.GetFileName(file);
        const pathToTrainingSet = GetDataSet(filename);
        const data = await Files.LoadJson(file);

        let newData = await CreateTrainingSet(pathToTrainingSet, data, defaultSettings);
        combinedData = combinedData.concat(newData);
    }

    // Create a combined copy of all the data
    await CreateTrainingSet(GetDataSet("Combined"), combinedData, defaultSettings);
})();
