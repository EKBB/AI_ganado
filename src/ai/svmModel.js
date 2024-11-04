// src/ai/svmModel.js
import * as tf from '@tensorflow/tfjs';

export const createSVMModel = () => {
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [3], units: 10, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });
    return model;
};

export const trainModel = async (model, data, labels) => {
    const xs = tf.tensor2d(data);
    const ys = tf.tensor2d(labels, [labels.length, 1]);
    await model.fit(xs, ys, { epochs: 50 });
    xs.dispose();
    ys.dispose();
};
