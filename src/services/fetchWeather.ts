import dayjs from "dayjs";

type WeatherAPIResponse = {
  daily: {
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    sunrise: string[];
    sunset: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    time: string[];
    weathercode: number[];
  };
  daily_units: {
    apparent_temperature_max: string;
    apparent_temperature_min: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    time: string;
    weathercode: string;
  };
  elevation: number;
  generationtime_ms: number;
  hourly: {
    apparent_temperature: number[];
    precipitation: number[];
    precipitation_probability: number[];
    temperature_2m: number[];
    time: string[];
    weathercode: number[];
  };
  hourly_units: {
    apparent_temperature: string;
    precipitation: string;
    precipitation_probability: string;
    temperature_2m: string;
    time: string;
    weathercode: string;
  };
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
};
type WeatherData = {
  hourly: {
    precipitation: number;
    precipitationChance: number;
    temperature: number;
    temperatureFeels: number;
    time: string;
    weatherCode: number;
  }[];
  today: {
    sunrise: string;
    sunset: string;
    temperatureFeelsMax: number;
    temperatureFeelsMin: number;
    temperatureMax: number;
    temperatureMin: number;
    weatherCode: number;
  };
};

export async function fetchWeather(): Promise<WeatherData> {
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=43.47246&longitude=-80.54477&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset&timezone=America%2FNew_York&forecast_days=3",
    {
      headers: {
        "User-Agent": "UWOne/0.1",
      },
    },
  );
  const data: WeatherAPIResponse = await res.json();
  const after = dayjs().subtract(1, "hour");
  const hourly = [];
  for (let i = 0; i < data.hourly.time.length; i++) {
    if (hourly.length >= 24) break;
    if (dayjs(data.hourly.time[i]) < after) continue;
    hourly.push({
      time: data.hourly.time[i],
      temperature: Math.round(data.hourly.temperature_2m[i]),
      temperatureFeels: Math.round(data.hourly.apparent_temperature[i]),
      precipitation: Math.round(data.hourly.precipitation[i]),
      precipitationChance: Math.round(data.hourly.precipitation_probability[i]),
      weatherCode: data.hourly.weathercode[i],
    });
  }

  return {
    hourly,
    today: {
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
      temperatureMax: Math.round(data.daily.temperature_2m_max[0]),
      temperatureMin: Math.round(data.daily.temperature_2m_min[0]),
      temperatureFeelsMax: Math.round(data.daily.apparent_temperature_max[0]),
      temperatureFeelsMin: Math.round(data.daily.apparent_temperature_min[0]),
      weatherCode: data.daily.weathercode[0],
    },
  };
}
