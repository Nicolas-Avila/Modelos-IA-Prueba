// weather.js
const latitude = -34.6037;
const longitude = -58.3816;
const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

export async function weather() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return `la temperatura es de ${data.current_weather.temperature}`;
  } catch (error) {
    return console.error("Error al obtener los datos del clima:", error);
     
  }
}
