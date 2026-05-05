export function toNaturalWeather(forecast) {
  const cloud = forecast.cloudcover;
  const wind = forecast.wind10m?.speed || 0;
  const rain = forecast.prec_type;

  return `
${cloud <= 3 ? "Ciel dégagé ☀️" : "Ciel nuageux ☁️"}
${wind > 5 ? "Conditions venteuses 🌬️" : "Vent léger 🍃"}
${rain !== "none" ? "Pluie prévue 🌧️" : "Pas de pluie 🌤️"}
`;
}

export function toLLMWeather(forecast) {
  const cloud = forecast.cloudcover;
  const wind = forecast.wind10m?.speed || 0;
  const windDir = forecast.wind10m?.direction || "inconnue";
  const rain = forecast.prec_type || "aucune";
  const temp = forecast.temp2m || "inconnue";
  const humidity = forecast.rh2m || "inconnue";
  const visibility = forecast.visibility || "inconnue";
  const pressure = forecast.sealevel_pressure || "inconnue";

  const cloudText =
    cloud <= 2 ? "ciel dégagé" :
    cloud <= 5 ? "partiellement nuageux" :
    "très nuageux";

  const windText =
    wind <= 3 ? "vent faible" :
    wind <= 7 ? "vent modéré" :
    "vent fort";

  const rainText =
    rain === "none" ? "aucune pluie prévue" :
    rain === "rain" ? "pluie possible" :
    rain;

  return `
DONNÉES MÉTÉO POUR MOTARD :

Couverture nuageuse : ${cloud}/9 (${cloudText})
Vent : ${wind} m/s (${windText})
Direction du vent : ${windDir}
Précipitations : ${rainText}
Température : ${temp}°C
Humidité : ${humidity}
Visibilité : ${visibility}
Pression : ${pressure}

TÂCHE POUR L'IA :
Tu es un assistant de sécurité pour motards.
Analyse ces données et donne des conseils de conduite (sécurité, équipement, risques).
`;
}
