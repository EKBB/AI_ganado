/* import React, { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as Papa from 'papaparse';

const GanadoPredictivo = () => {
    // Función para cargar y preprocesar los datos
    const loadData = async (filePath) => {
        const response = await fetch(filePath);
        const data = await response.text();

        const parsedData = Papa.parse(data, { header: true }).data;

        // Convertir los datos a formato numérico
        const inputs = [];
        const labels = [];

        parsedData.forEach(row => {
            const lat = parseFloat(row.Latitud);
            const long = parseFloat(row.Longitud);
            const velocidad = parseFloat(row.Velocidad);
            const comportamiento = row.Comportamiento === 'Normal' ? 0 : 1; // Codificación: Normal=0, Desviado=1

            inputs.push([lat, long, velocidad]);
            labels.push([comportamiento]);
        });

        return {
            inputs: tf.tensor2d(inputs),
            labels: tf.tensor2d(labels),
        };
    };

    // Función para crear y entrenar el modelo
    const createAndTrainModel = async () => {
        const { inputs, labels } = await loadData('/comportamiento_ganado_simulado.csv'); // Ajusta la ruta según la ubicación del archivo
        const model = await createModel();
        await trainModel(model, inputs, labels);
    };

    const createModel = async () => {
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [3] })); // 3 entradas: latitud, longitud, velocidad
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' })); // Salida binaria

        model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

        return model;
    };

    const trainModel = async (model, inputs, labels) => {
        await model.fit(inputs, labels, {
            epochs: 100,
            batchSize: 32,
            validationSplit: 0.2, // 20% para validación
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log(`Epoch: ${epoch}, Loss: ${logs.loss}, Accuracy: ${logs.acc}`);
                },
            },
        });
    };

    useEffect(() => {
        createAndTrainModel();
    }, []);

    return <div>Entrenando el modelo...</div>;
};

export default GanadoPredictivo;
 */