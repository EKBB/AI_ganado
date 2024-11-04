const API_KEY = 'pk.6273f17ce79d1c44781c0cdf624ffd5eQ';

export const getTerrainData = async (lat, lon) => {
    const url = `https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${lat}&lon=${lon}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Extrae características de interés del terreno
    const terrainFeatures = {
        elevation: data.elevation,  // si está disponible
        roadType: data.road || null,
        vegetation: data.vegetation || 'unknown',
    };

    return terrainFeatures;
};