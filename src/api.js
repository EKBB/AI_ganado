//const apiKey = "pk.6273f17ce79d1c44781c0cdf624ffd5eQ";
// api.js
export const getUserLocation = async () => {
    const apiKey = "pk.6273f17ce79d1c44781c0cdf624ffd5eQ"; // O sustituye con tu API key directamente
    const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=auto&lon=auto&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener la ubicación");

        const data = await response.json();
        return {
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lon),
        };
    } catch (error) {
        console.error("Error en la API de LocationIQ:", error);
        return null;
    }
};
