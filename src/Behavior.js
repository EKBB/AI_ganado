// Archivo: PredictiveModel.js
import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

function PredictiveModel() {
   const [prediction, setPrediction] = useState(null);

   // Definir y entrenar el modelo
   const trainModel = async () => {
      // Crear el modelo secuencial
      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 10, inputShape: [2], activation: 'relu' }));
      model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

      // Compilar el modelo
      model.compile({
         optimizer: 'adam',
         loss: 'binaryCrossentropy',
         metrics: ['accuracy'],
      });

      // Datos de entrenamiento y etiquetas (0 = normal, 1 = desvío)
      const trainingData = tf.tensor2d([
         [0.1, 0.5],
         [0.3, 0.8],
         [0.4, 0.4],
         [0.7, 0.2],
      ]);
      const labels = tf.tensor2d([[1], [1], [0], [0]]);

      // Entrenar el modelo
      await model.fit(trainingData, labels, {
         epochs: 50, // Más epochs puede mejorar el rendimiento
         verbose: 1,
      });

      // Guardar el modelo entrenado en el estado
      return model;
   };

   // Predicción con datos nuevos
   const makePrediction = async () => {
      const model = await trainModel();

      // Ejemplo de nuevos datos para predecir
      const testData = tf.tensor2d([[0.2, 0.6]]);
      const prediction = model.predict(testData);

      // Obtener el valor de la predicción
      const predictionValue = prediction.dataSync()[0];
      setPrediction(predictionValue > 0.5 ? "Posible Desvío" : "Normal");
   };

   return (
      <div>
         <h1>Modelo Predictivo de Ganado</h1>
         <button onClick={makePrediction}>Predecir Desvío</button>
         {prediction && <p>Predicción: {prediction}</p>}
      </div>
   );
}

export default PredictiveModel;
