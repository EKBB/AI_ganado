import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const RouteMap = ({ routes, setRoutes }) => {
    const [waypoints, setWaypoints] = useState([]);

    // Componente para manejar eventos del mapa
    const MapEvents = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setWaypoints(prev => [...prev, [lat, lng]]);
            },
        });
        return null;
    };
    const handleCalculateRoute = () => {
        if (waypoints.length < 2) {
            alert("Necesitas al menos dos puntos para calcular la ruta.");
            return;
        }
    
        // Llama a la función pasada para manejar la nueva ruta y pasar los waypoints
        setRoutes(waypoints);
    
        // Limpiar waypoints después de calcular la ruta
        setWaypoints([]);
    };
    

    return (
        <div>
            <MapContainer center={[0, 0]} zoom={3} style={{ height: '500px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapEvents />
                {routes.map((route, index) => (
                    <Polyline
                        key={index}
                        positions={route.path}
                        color={route.isSafe ? 'green' : 'red'}
                    />
                ))}
                {waypoints.length > 0 && (
                    <Polyline
                        positions={waypoints}
                        color='blue'
                        dashArray='5, 5' // Estilo de línea discontinua para la ruta en construcción
                    />
                )}
            </MapContainer>
            <button onClick={handleCalculateRoute} style={{ marginTop: '10px' }}>Calcular Ruta</button>
        </div>
    );
};

export default RouteMap;
