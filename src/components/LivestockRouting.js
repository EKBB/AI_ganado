// src/components/LivestockRouting.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { createSVMModel, trainModel } from '../ai/svmModel';
import { getTerrainData } from '../api/locationService';
import * as tf from '@tensorflow/tfjs';

const LivestockRouting = () => {
    const [model, setModel] = useState(null);
    const [route, setRoute] = useState([]);
    const [safeRoute, setSafeRoute] = useState([]);

    useEffect(() => {
        const initializeModel = async () => {
            const svmModel = createSVMModel();
            
            // Datos de entrenamiento de ejemplo
            const trainingData = [[100, 1, 0], [200, 0, 1], [150, 1, 0]];
            const labels = [1, 0, 1]; // 1 = seguro, 0 = peligroso
            await trainModel(svmModel, trainingData, labels);

            setModel(svmModel);
        };
        initializeModel();
    }, []);

    const analyzeTerrain = async (lat, lon) => {
        const terrainData = await getTerrainData(lat, lon);
        const input = tf.tensor2d([[terrainData.elevation, terrainData.roadType === 'safe' ? 1 : 0, terrainData.vegetation === 'grass' ? 1 : 0]]);
        const prediction = model.predict(input);
        const isSafe = prediction.dataSync()[0] > 0.5;
        input.dispose();
        return isSafe;
    };

    const generateSafeRoute = async () => {
        const newRoute = [...route]; // Define puntos iniciales aquí
        const filteredRoute = [];

        for (const point of newRoute) {
            const isSafe = await analyzeTerrain(point.lat, point.lon);
            if (isSafe) {
                filteredRoute.push(point);
            }
        }
        setSafeRoute(filteredRoute);
    };

    return (
        <div>
            <MapContainer center={[19.4326, -99.1332]} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {route.map((point, idx) => (
                    <Marker key={idx} position={[point.lat, point.lon]} />
                ))}
                <Polyline positions={safeRoute.map(point => [point.lat, point.lon])} color="blue" />
            </MapContainer>
            <button onClick={generateSafeRoute}>Generar Ruta Segura</button>
        </div>
    );
};

export default LivestockRouting;
