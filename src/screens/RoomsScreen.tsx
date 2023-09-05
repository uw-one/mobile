import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { ReactNode, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Avatar, Chip, Divider, List, Text, useTheme } from "react-native-paper";
import { Screen } from "@/components";
import { fetchRooms } from "@/services/fetchRooms";

export function RoomsScreen() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
    cacheTime: 1000 * 80 * 15,
  });
  const [isOpenLaterSelected, setIsOpenLaterSelected] = useState(false);
  const [isOpenNowSelected, setIsOpenNowSelected] = useState(true);
  const theme = useTheme();
  const title = "Open Classrooms";

  if (isLoading) {
    return (
      <Screen name={title} classNames="justify-center items-center">
        <ActivityIndicator size={36} />
      </Screen>
    );
  } else if (isError) {
    return (
      <Screen name={title} classNames="justify-center items-center">
        <Text>Something went wrong.</Text>
      </Screen>
    );
  }

  data.sort((a, b) => a.code.localeCompare(b.code));
  const Buildings: ReactNode[] = [];
  const now = dayjs();
  for (const building of data) {
    let roomsOpenNow = 0;
    let roomsOpenLater = 0;
    const Rooms: ReactNode[] = [];

    for (const room of building.rooms) {
      if (room.slots.length === 0) continue;
      let hasRoomOpenNow = false;
      let hasRoomOpenLater = false;
      const Slots: ReactNode[] = [];

      for (const slot of room.slots) {
        const start = dayjs(slot.start);
        const end = dayjs(slot.end);
        const slotOpenNow = now.isAfter(start) && now.isBefore(end);
        const slotOpenLater = now.isBefore(start);
        if (slotOpenNow) {
          hasRoomOpenNow = true;
        } else if (slotOpenLater) {
          hasRoomOpenLater = true;
        } else {
          continue;
        }
        // show all slots
        Slots.push(
          <Text
            variant="bodyMedium"
            className={slotOpenNow ? "text-green-500" : "text-blue-400"}
            key={JSON.stringify(slot)}
          >
            {`${start.format("dddd: hh:mm a")} - ${end.format("hh:mm a")}`}
          </Text>,
        );
      }

      if (hasRoomOpenNow) roomsOpenNow += 1;
      if (hasRoomOpenLater) roomsOpenLater += 1;
      // only show rooms of the filter
      if ((isOpenNowSelected && hasRoomOpenNow) || (isOpenLaterSelected && hasRoomOpenLater)) {
        Rooms.push(
          <List.Item
            title={`${building.code} ${room.number}`}
            description={() => <View>{Slots}</View>}
            left={() => <View className="w-[52px] h-[52px]" />}
            key={`${building.code} ${room.number}`}
          />,
        );
      }
    }

    // only show buildings of the filter
    if ((isOpenNowSelected && roomsOpenNow > 0) || (isOpenLaterSelected && roomsOpenLater > 0)) {
      Buildings.push(
        <List.Accordion
          title={building.name}
          description={`${roomsOpenNow} open now ⋅ ${roomsOpenLater} open later`}
          style={{ paddingRight: 0 }}
          left={() => (
            <Avatar.Text
              className={`rounded-lg ${roomsOpenNow > 0 ? "bg-green-500" : "bg-blue-400"}`}
              label={building.code}
              size={52}
              labelStyle={{ fontWeight: "bold", fontSize: 16, color: "black" }}
            />
          )}
          theme={{ colors: { primary: "#71c766" } }}
          key={building.code}
        >
          {Rooms}
        </List.Accordion>,
      );
    }
  }

  return (
    <Screen name={title}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-row space-x-2 mb-4">
          <Chip
            mode="outlined"
            style={isOpenNowSelected && { backgroundColor: theme.colors.secondaryContainer }}
            selected={isOpenNowSelected}
            onPress={() => setIsOpenNowSelected(!isOpenNowSelected)}
            showSelectedCheck
          >
            Open Now
          </Chip>
          <Chip
            mode="outlined"
            style={isOpenLaterSelected && { backgroundColor: theme.colors.secondaryContainer }}
            selected={isOpenLaterSelected}
            onPress={() => setIsOpenLaterSelected(!isOpenLaterSelected)}
            showSelectedCheck
          >
            Open Later
          </Chip>
        </View>

        <Divider />
        {Buildings}
      </ScrollView>
    </Screen>
  );
}
