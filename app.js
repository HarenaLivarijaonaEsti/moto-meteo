import express from "express";
import axios from "axios";
import { toLLMWeather, toNaturalWeather } from "./services/traductionJson.js";
import { promptForLLM } from "./services/prompt.js";
import { InterpretationLLM } from "./services/interpretationLLM.js";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", async (req, res) => {
  try {
    const city = req.body.city
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // 1. GEO
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${city}&format=json`;

    const geoRes = await axios.get(geoUrl, {
      headers: { "User-Agent": "meteo-app" },
    });

    if (!geoRes.data.length) {
      return res.send("Ville introuvable");
    }

    const lat = Number(geoRes.data[0].lat);
    const lon = Number(geoRes.data[0].lon);

    // 2. WEATHER
    const weatherUrl = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=astro&output=json`;

    const weatherRes = await axios.get(weatherUrl);

    const dataCloudy = weatherRes.data;

    const forecast =
      dataCloudy.dataseries?.find((d) => d.timepoint >= 12) ||
      dataCloudy.dataseries?.[0];

    // 3. TRADUCTION
    const naturalWeather = toNaturalWeather(forecast);

    // 4. PROMPT
    const llmWeather = toLLMWeather(forecast);
    const prompt = promptForLLM(llmWeather);

    // 5. INTERPRETATION
    
    const interpretation = await InterpretationLLM(prompt);

    // 5. RENDER
    res.render("result", {
      city,
      lat,
      lon,
      forecast,
      naturalWeather,
      interpretation,
    });
  } catch (error) {
    console.error(error.message);
    res.send("Erreur API");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
