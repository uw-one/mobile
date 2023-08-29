import React, { ComponentType } from "react";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { MapsScreen, MoreScreen, RoomsScreen, ScheduleScreen, WeatherScreen } from "@/screens";

type TabData = {
  name: string;
  component: ComponentType;
  focusedIcon: string;
  unfocusedIcon: string;
};

const Tab = createMaterialBottomTabNavigator();

export function HomeNavigator() {
  const tabs: TabData[] = [
    {
      name: "Weather",
      component: WeatherScreen,
      focusedIcon: "cloud",
      unfocusedIcon: "cloud-outline",
    },
    {
      name: "Maps",
      component: MapsScreen,
      focusedIcon: "compass",
      unfocusedIcon: "compass-outline",
    },
    {
      name: "Schedule",
      component: ScheduleScreen,
      focusedIcon: "calendar",
      unfocusedIcon: "calendar-outline",
    },
    {
      name: "Rooms",
      component: RoomsScreen,
      focusedIcon: "book-open-page-variant",
      unfocusedIcon: "book-open-page-variant-outline",
    },
    {
      name: "More",
      component: MoreScreen,
      focusedIcon: "dots-horizontal",
      unfocusedIcon: "dots-horizontal",
    },
  ];

  return (
    <Tab.Navigator>
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? tab.focusedIcon : tab.unfocusedIcon}
                size={24}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
