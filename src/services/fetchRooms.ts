import dayjs from "dayjs";

type RoomsAPIResonse = {
  meta: {
    status: number;
    type: string;
    message: string | null;
    errors: string | null;
    datetime: string | null;
  };
  data: {
    meta: string | null;
    type: string;
    features: {
      type: string;
      properties: {
        buildingId: string;
        buildingCode: string;
        buildingName: string;
        parentBuildingCode: null;
        alternateBuildingNames: null;
        building_sections: null;
        youtube_vid: null;
        streamable_vid: null;
        rawPropertiesStr: string;
        supportOpenClassroom: boolean;
        openClassroomSlots: string;
        building_id: string;
        building_code: string;
        building_name: string;
        building_parent: null;
      };
      geometry: {
        coordinates: [number, number];
        type: string;
      };
    }[];
  };
};
type OpenClassroomSlots = {
  data: {
    Schedule: {
      Weekday: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
      Slots: {
        StartTime: string;
        EndTime: string;
      }[];
    }[];
    GeneratedTime: string;
    roomNumber: string;
    buildingCode: string;
  }[];
  lastUpdated: string;
};
type RoomsData = {
  code: string;
  name: string;
  rooms: {
    number: string;
    slots: {
      start: string;
      end: string;
    }[];
  }[];
}[];

export async function fetchRooms(): Promise<RoomsData> {
  const res = await fetch("https://portalapi2.uwaterloo.ca/v2/map/OpenClassrooms", {
    headers: {
      "User-Agent": "UWOne/0.1",
    },
  });
  const data: RoomsAPIResonse = await res.json();
  const now = dayjs().millisecond(0);
  const nowWeekday = now.day();
  const weekdayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  return data.data.features.map((building) => ({
    code: building.properties.buildingCode,
    name: building.properties.buildingName,
    rooms: (JSON.parse(building.properties.openClassroomSlots) as OpenClassroomSlots).data.map(
      (room) => {
        const slots: RoomsData[0]["rooms"][0]["slots"] = [];

        for (const weekday of room.Schedule) {
          const targetWeekday = weekdayMap[weekday.Weekday];
          const daysUntilTarget = (targetWeekday - nowWeekday + 7) % 7;
          const targetDate = now.add(daysUntilTarget, "day");

          for (const slot of weekday.Slots) {
            const start = slot.StartTime.split(":").map(Number) as [number, number, number];
            const end = slot.EndTime.split(":").map(Number) as [number, number, number];
            slots.push({
              start: targetDate
                .set("hour", start[0])
                .set("minute", start[1])
                .set("second", start[2])
                .toISOString(),
              end: targetDate
                .set("hour", end[0])
                .set("minute", end[1])
                .set("second", end[2])
                .toISOString(),
            });
          }
        }
        return { number: room.roomNumber, slots };
      },
    ),
  }));
}
