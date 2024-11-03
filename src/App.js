import React, { useState, useEffect } from 'react';
import RouteMap from './components/RouteMap';
import * as tf from '@tensorflow/tfjs';

const App = () => {
    const [routes, setRoutes] = useState([]);
    const [model, setModel] = useState(null);

    // Datos de entrenamiento (ejemplo de coordenadas)
    const trainData = tf.tensor2d([
        [1.0, 2.0], // Coordenadas de ejemplo
        [3.0, 4.0],
        [5.0, 6.0],
        [7.0, 8.0],
        [9.0, 10.0],
    ]);

    // Etiquetas (1 = seguro, 0 = peligroso)
    const labels = tf.tensor2d([
        [1],
        [0],
        [1],
        [0],
        [1],
    ]);

    useEffect(() => {
        const trainModel = async () => {
            // Crea el modelo
            const newModel = tf.sequential();
            newModel.add(tf.layers.dense({ units: 5, activation: 'relu', inputShape: [2] }));
            newModel.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

            // Compila el modelo
            newModel.compile({ optimizer: 'adam', loss: 'binaryCrossentropy' });

            // Entrena el modelo
            await newModel.fit(trainData, labels, {
                epochs: 100,
                shuffle: true,
            });

            setModel(newModel); // Guardar el modelo en el estado
        };

        trainModel();
    }, []);

    const handleNewRoute = async (waypoints) => {
        if (!model) {
            console.error("Modelo no disponible para predicción.");
            return;
        }

        // Predicción para cada punto de los waypoints
        const predictions = await Promise.all(waypoints.map(async (point) => {
            const input = tf.tensor2d([[point[0], point[1]]]); // Coordenadas a predecir
            const prediction = await model.predict(input).dataSync();
            return prediction[0]; // Devuelve la predicción (0 o 1)
        }));

        console.log('Predicciones de seguridad:', predictions);

        // Supongamos que se considera "segura" si todos los puntos son seguros
        const isSafe = predictions.every(pred => pred > 0.5);

        // Agregar la nueva ruta al estado
        setRoutes(prevRoutes => [
            ...prevRoutes,
            { path: waypoints, isSafe }
        ]);
    };

    return (
        <div>
            <h1>Optimización de Rutas para Ganado</h1>
            <RouteMap routes={routes} setRoutes={handleNewRoute} />
        </div>
    );
};

export default App;
