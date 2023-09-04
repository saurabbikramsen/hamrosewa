// collaborative-filtering.service.ts

import { Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class CollaborativeFilteringService {
  private model: tf.Sequential;

  constructor() {
    // Initialize your TensorFlow model here
    this.model = tf.sequential();
    const inputSize = 6;
    const numItems = 50;
    // Add layers and compile your model
    // Example:
    this.model.add(
      tf.layers.dense({
        units: 128,
        activation: 'relu',
        inputShape: [inputSize],
      }),
    );
    this.model.add(tf.layers.dense({ units: numItems, activation: 'softmax' }));
    this.model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' });
  }

  trainModel(trainingData: any[]) {
    // Preprocess training data
    const input = trainingData.map((item) => item.input);
    const output = trainingData.map((item) => item.output);

    const inputTensor = tf.tensor(input);
    const outputTensor = tf.tensor(output);

    // Train the model
    this.model.fit(inputTensor, outputTensor, { epochs: 10 });
  }

  predict(userInput: number[]): number[] {
    const inputTensor = tf.tensor([userInput]);
    const predictionTensor = this.model.predict(inputTensor) as tf.Tensor;
    const predictionArray = predictionTensor.arraySync()[0];

    return predictionArray;
  }
}
