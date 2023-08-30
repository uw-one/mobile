import React, { ReactNode } from "react";
import { View } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  actions?: {
    icon: string;
    onPress: () => void;
  }[];
  classNames?: string;
  footer?: ReactNode;
  name: string;
  noHeader?: boolean;
  noPadding?: boolean;
  children: ReactNode;
};

export function Screen({
  actions,
  classNames,
  footer,
  name,
  noHeader,
  noPadding,
  children,
}: ScreenProps) {
  if (noHeader) {
    return (
      <SafeAreaView className={`${!noPadding && "w-full flex-1 px-4"} ${classNames}`}>
        {children}
      </SafeAreaView>
    );
  }

  return (
    <View className="min-h-full w-full">
      <Appbar.Header mode="small">
        <Appbar.Content title={name} />
        {(actions ?? []).map(({ icon, onPress }) => (
          <Appbar.Action icon={icon} onPress={onPress} key={icon} />
        ))}
      </Appbar.Header>
      <View className={`flex-1 ${!noPadding && "px-4"} ${classNames}`}>{children}</View>
      {footer}
    </View>
  );
}
