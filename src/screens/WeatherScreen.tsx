import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Divider, Surface, Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Screen } from "@/components";
import { fetchWeather } from "@/services";

export function WeatherScreen() {
  const { data, isError, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeather,
    cacheTime: 1000 * 80 * 15,
  });
  const theme = useTheme();

  if (isLoading) {
    return (
      <Screen name="Weather" classNames="flex-1 items-center justify-center gap-4">
        <ActivityIndicator size={36} />
      </Screen>
    );
  } else if (isError) {
    return (
      <Screen name="Weather" classNames="flex-1 items-center justify-center">
        <Text>Something went wrong.</Text>
      </Screen>
    );
  }

  return (
    <Screen name="Weather" classNames="flex-1 gap-4">
      <Text variant="bodySmall" className="italic">
        Last updated at {dayjs(dataUpdatedAt).format("h:mm a")} · Open-Meteo API
      </Text>

      <Surface className="flex items-center p-2 rounded-xl">
        <Text className="mb-2">Currently</Text>
        <View className="relative">
          <Text variant="displayLarge">{data.hourly[0].temperature}</Text>
          <Text
            variant="displaySmall"
            className="absolute right-0 translate-x-[16px]"
            style={{ color: theme.colors.outline }}
          >
            ᶜ
          </Text>
        </View>
        <Surface elevation={5} className="flex flex-row space-x-2 mb-4 py-1 px-4 rounded-full">
          <MaterialCommunityIcons name="weather-sunny" color="#ffe49c" size={28.2} />
          <Text variant="titleLarge">Sunny</Text>
        </Surface>
        <Text variant="bodyLarge">
          Precipitation: <Text className="font-bold">{data.hourly[0].precipitationChance}%</Text> ·{" "}
          <Text className="font-bold">{data.hourly[0].precipitation}mm</Text>
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
            className="w-[95px] flex items-center border rounded-xl py-2"
            style={{ borderColor: theme.colors.outlineVariant }}
            key={index}
          >
            <Text>
              {dayjs(hourData.time)
                .format("h a")
                .replace(/([ap])m/, "$1.m.")}
            </Text>
            <MaterialCommunityIcons name="weather-sunny" color="#ffe49c" size={64} />
            <Text variant="titleMedium">{hourData.temperature}ᶜ</Text>
            <Text variant="bodySmall">Feels {hourData.temperatureFeels}ᶜ</Text>
            <Text variant="bodySmall" className="text-sky-200">
              {hourData.precipitationChance}% · {hourData.precipitation}m
            </Text>
          </View>
        ))}
      </ScrollView>

      <Divider />
      <Text variant="titleMedium">Daily (7d)</Text>
      <Text>Coming soon!</Text>
    </Screen>
  );
}
