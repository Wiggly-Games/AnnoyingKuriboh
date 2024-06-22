/*
    training script. This will take all the json files under TrainingData,
    train the Markov Chain against them, and store the results where the
    bot can access them later.
*/

import { ChainConfiguration, MarkovChain } from "@wiggly-games/markov-chains"
import * as Files from "@wiggly-games/files"
import { Paths, Initialize as InitializePaths, GetDataSet } from "./Helpers";

const TRAINING_DATA = "./TrainingData";

function buildWords(input: string[]): string[][] {
    const trainingData: string[][] = [];

    input.forEach(line => {
        let sentences = line.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split(/[\|\n]/).map(x => x.trim()).filter(x => x !== "");
        sentences.forEach(sentence => {
            let words = sentence.split(" ").filter(x => x !== "");
            trainingData.push(words);
        });
    });

    return trainingData;
}

async function CreateTrainingSet(path: string, data: string[], settings: ChainConfiguration): Promise<string[]> {
    Files.CreateDirectory(path);

    let chain = new MarkovChain<string>(path, settings);

    const trainingSet = buildWords(data);
    await chain.Train(trainingSet);
    await chain.Save((x) => x);

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
        MinRequiredOptions: 2,
        StopAtFewerOptions: false
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
