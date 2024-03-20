import { useEffect, useState } from "react"; // Importation des hooks useEffect et useState depuis React
import loader from "./assets/loader.svg"; // Importation de l'image de chargement
import browser from "./assets/browser.svg"; // Importation de l'image d'erreur
import "./App.css"; // Importation des styles CSS
const APIKEY = import.meta.env.VITE_WEATHER_API_KEY; // Récupération de la clé API depuis les variables d'environnement

function App() {
  const [weatherData, setWeatherData] = useState(null); // État pour stocker les données météo
  const [errorInfo, setErrorInfo] = useState(null); // État pour stocker les informations sur les erreurs

  useEffect(() => {
    // Effet utilisé pour effectuer la requête API lors du chargement initial

    fetch(`http://api.airvisual.com/v2/nearest_city?key=${APIKEY}`)
      .then(response => {
        console.log(response); // Affichage de la réponse pour le débogage

        // Gestion des erreurs HTTP
        if (!response.ok) throw new Error(`Error ${response.status}, ${response.statusText}`);

        return response.json(); // Conversion de la réponse en JSON
      })
      .then(responseData => {
        // Traitement des données reçues
        setWeatherData({
          city: responseData.data.city,
          country: responseData.data.country,
          iconId: responseData.data.current.weather.ic,
          temperature: responseData.data.current.weather.tp,
        });
      })
      .catch(err => {
        // Gestion des erreurs
        setErrorInfo(err.message);
      });
  }, []); // Tableau de dépendances vide pour n'exécuter cet effet qu'une seule fois lors du chargement initial de l'application

  return (
    <main>
      {/* Conteneur de chargement conditionnel */}
      <div className={`loader-container ${(!weatherData && !errorInfo) && "active"}`}>
        <img src={loader} alt="loading icon" />
      </div>

      {/* Affichage des données météo si disponibles */}
      {weatherData && (
        <>
          <p className="city-name">{weatherData.city}</p>
          <p className="country-name">{weatherData.country}</p>
          <p className="temperature">{weatherData.temperature}°</p>
          <div className="info-icon-container">
            <img src={`/icons/${weatherData.iconId}.svg`} className="info-icon" alt="weather icon" />
          </div>
        </>
      )}

      {/* Affichage des informations d'erreur si présentes */}
      {(errorInfo && !weatherData) && (
        <>
          <p className="error-information">{errorInfo}</p>
          <img src={browser} alt="error icon" />
        </>
      )}
    </main>
  );
}

export default App;
