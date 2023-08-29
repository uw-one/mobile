export type FetchWeatherResponse = {
  hourly: {
    precipitation: number;
    precipitationChance: number;
    temperature: number;
    temperatureFeels: number;
    time: string;
    weatherCode: number;
  }[];
  today: {
    temperatureFeelsMax: number;
    temperatureFeelsMin: number;
    temperatureMax: number;
    temperatureMin: number;
    weatherCode: number;
  };
};
