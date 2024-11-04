import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Importa los iconos de Leaflet para los marcadores
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const RouteMap = ({ routes, setRoutes }) => {
    const [waypoints, setWaypoints] = useState([]);

    // Coordenadas proporcionadas como punto inicial de prueba
    const initialCoordinate = [33.65262779186769, -109.28775388073186];
    const [markers, setMarkers] = useState([initialCoordinate]);

    // Componente para manejar eventos del mapa
    const MapEvents = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                const newPoint = [lat, lng];
                setMarkers(prev => [...prev, newPoint]);
                setWaypoints(prev => [...prev, newPoint]);
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
            <MapContainer center={initialCoordinate} zoom={13} style={{ height: '500px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapEvents />
                {/* Mostrar marcadores */}
                {markers.map((position, idx) => (
                    <Marker key={idx} position={position}>
                        <Popup>
                            Punto {idx + 1}: {position[0].toFixed(6)}, {position[1].toFixed(6)}
                        </Popup>
                    </Marker>
                ))}
                {/* Mostrar rutas */}
                {routes.map((route, index) => (
                    <Polyline
                        key={index}
                        positions={route.path}
                        color={route.isSafe ? 'green' : 'red'}
                    />
                ))}
                {/* Mostrar ruta en construcción */}
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
