import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { ActivityIndicator, Divider, Snackbar, Surface, Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Screen } from "@/components";
import { fetchWeather } from "@/services";

const REFRESH_RATE_LIMIT_MINUTES = 5;

export function WeatherScreen() {
  const { data, isError, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeather,
    cacheTime: 1000 * 80 * 15,
  });
  const [isRefreshControlShown, setIsRefreshControlShown] = useState(false);
  const [isSnackbarShown, setIsSnackbarShown] = useState(false);
  const queryClient = useQueryClient();
  const theme = useTheme();

  function onRefresh() {
    if (dayjs().diff(dayjs(dataUpdatedAt), "minute") >= REFRESH_RATE_LIMIT_MINUTES) {
      queryClient.invalidateQueries(["weather"]);
    } else {
      setIsSnackbarShown(true);
    }
  }
  const actions = [{ icon: "refresh", onPress: onRefresh }];
  const snackbarFooter = (
    <Snackbar
      visible={isSnackbarShown}
      onDismiss={() => setIsSnackbarShown(false)}
      action={{
        label: "Dismiss",
        onPress: () => setIsSnackbarShown(false),
      }}
    >
      {`You can only refresh every ${REFRESH_RATE_LIMIT_MINUTES} minutes.`}
    </Snackbar>
  );
  const title = "Weather (Waterloo, ON)";

  if (isLoading) {
    return (
      <Screen name={title} classNames="justify-center items-center" actions={actions}>
        <ActivityIndicator size={36} />
      </Screen>
    );
  } else if (isError) {
    return (
      <Screen name={title} classNames="justify-center items-center" actions={actions}>
        <Text>Something went wrong.</Text>
      </Screen>
    );
  }

  const sunrise = dayjs(data.today.sunrise);
  const sunset = dayjs(data.today.sunset);
  function getWeatherTheme(code: number, timeString: string) {
    const time = dayjs(timeString);
    const isTimeDay =
      sunrise.hour() * 60 + sunrise.minute() <= time.hour() * 60 + time.minute() &&
      time.hour() * 60 + time.minute() <= sunset.hour() * 60 + sunset.minute();
    switch (code) {
      case 0:
        return isTimeDay
          ? { title: "Sunny", name: "weather-sunny", color: "#FFE49C" }
          : { title: "Clear", name: "weather-night", color: "#9EC0FF" };
      case 1:
        return isTimeDay
          ? { title: "Partly Clear", name: "weather-partly-cloudy", color: "#C2C2C2" }
          : { title: "Partly Clear", name: "weather-night-partly-cloudy", color: "#C2C2C2" };
      case 2:
        return isTimeDay
          ? { title: "Mostly Clear", name: "weather-partly-cloudy", color: "#C2C2C2" }
          : { title: "Mostly Clear", name: "weather-night-partly-cloudy", color: "#C2C2C2" };
      case 3:
        return { title: "Cloudy", name: "weather-cloudy", color: "#C2C2C2" };
      case 45:
        return { title: "Fog", name: "weather-fog", color: "#C2C2C2" };
      case 48:
        return { title: "Icy Fog", name: "weather-fog", color: "#C2C2C2" };
      case 51:
      case 53:
        return { title: "Drizzle", name: "weather-rainy", color: "#C2C2C2" };
      case 55:
        return { title: "Heavy Drizzle", name: "weather-pouring", color: "#BFBFBF" };
      case 56:
      case 57:
        return { title: "Freezing Drizzle", name: "weather-snowy-rainy", color: "#BCC6D6" };
      case 61:
        return { title: "Light Rain", name: "weather-rainy", color: "#B6C6E3" };
      case 63:
        return { title: "Rain", name: "weather-pouring", color: "#B6C6E3" };
      case 65:
        return { title: "Heavy Rain", name: "weather-pouring", color: "#B6C6E3" };
      case 66:
      case 67:
        return { title: "Freezing Rain", name: "weather-snowy-rainy", color: "#B6C6E3" };
      case 71:
      case 73:
        return { title: "Snow", name: "weather-snowy", color: "#DAEFF5" };
      case 75:
        return { title: "Heavy Snow", name: "weather-snowy-heavy", color: "#DAEFF5" };
      case 77:
        return { title: "Snow", name: "weather-snowy", color: "#DAEFF5" };
      case 80:
        return { title: "Light Showers", name: "weather-rainy", color: "#B6C6E3" };
      case 81:
      case 82:
        return { title: "Showers", name: "weather-pouring", color: "#B6C6E3" };
      case 85:
        return { title: "Snow Showers", name: "weather-snowy", color: "#DAEFF5" };
      case 86:
        return { title: "Snow Showers", name: "weather-snowy-heavy", color: "#DAEFF5" };
      case 95:
        return { title: "Thunderstorms", name: "weather-lightning", color: "#B09CBA" };
      default:
        return { title: "Error", name: "help-circle", color: "#FFFFFF" };
    }
  }
  const nowData = data.hourly[0];
  const nowWeatherTheme = getWeatherTheme(nowData.weatherCode, nowData.time);

  return (
    <Screen name={title} actions={actions} footer={snackbarFooter}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshControlShown}
            onRefresh={() => {
              setIsRefreshControlShown(true);
              onRefresh();
              setIsRefreshControlShown(false);
            }}
          />
        }
        className="flex-1 space-y-4"
      >
        <Text variant="bodySmall" className="italic">
          Last updated at {dayjs(dataUpdatedAt).format("h:mm a")} · Open-Meteo API
        </Text>

        <Surface className="flex items-center p-2 rounded-lg">
          <Text className="mb-2">Currently</Text>
          <View className="relative">
            <Text variant="displayLarge">{nowData.temperature}</Text>
            <Text
              variant="displaySmall"
              className="absolute right-0 translate-x-[16px]"
              style={{ color: theme.colors.outline }}
            >
              ᶜ
            </Text>
          </View>
          <Text variant="bodyLarge">
            Feels <Text className="font-bold">{nowData.temperatureFeels}ᶜ</Text>
          </Text>
          <Surface elevation={5} className="flex flex-row space-x-2 my-4 py-1 px-4 rounded-full">
            <MaterialCommunityIcons {...nowWeatherTheme} size={28.2} />
            <Text variant="titleLarge">{nowWeatherTheme.title}</Text>
          </Surface>
          <Text variant="bodyLarge">
            Precipitation: <Text className="font-bold">{nowData.precipitationChance}%</Text> ·{" "}
            <Text className="font-bold">{nowData.precipitation}mm</Text>
          </Text>
          <Text variant="bodyLarge">
            High: <Text className="font-bold">{data.today.temperatureMax}ᶜ</Text> (feels{" "}
            <Text className="font-bold">{data.today.temperatureFeelsMax}</Text>ᶜ)
          </Text>
          <Text variant="bodyLarge">
            Low: <Text className="font-bold">{data.today.temperatureMin}ᶜ</Text> (feels{" "}
            <Text className="font-bold">{data.today.temperatureFeelsMin}</Text>ᶜ)
          </Text>
        </Surface>

        <Divider />
        <Text variant="titleMedium">Hourly (24h)</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex flex-row space-x-2"
        >
          {data.hourly.map((hourData, index) => (
            <View
              className="w-[95px] flex items-center border rounded-lg py-2"
              style={{ borderColor: theme.colors.outline }}
              key={index}
            >
              <Text>
                {dayjs(hourData.time)
                  .format("h a")
                  .replace(/([ap])m/, "$1.m.")}
              </Text>
              <MaterialCommunityIcons
                {...getWeatherTheme(hourData.weatherCode, hourData.time)}
                size={64}
              />
              <Text variant="titleMedium">{hourData.temperature}ᶜ</Text>
              <Text variant="bodySmall">Feels {hourData.temperatureFeels}ᶜ</Text>
              <Text variant="bodySmall" className="text-sky-200">
                {hourData.precipitationChance}% · {hourData.precipitation}mm
              </Text>
            </View>
          ))}
        </ScrollView>

        <Divider />
        <Text variant="titleMedium">Daily (7d)</Text>
        <Text>Coming soon!</Text>
      </ScrollView>
    </Screen>
  );
}
