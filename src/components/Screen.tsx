import React, { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  classNames?: string;
  name: string;
  noHeader?: boolean;
  noPadding?: boolean;
  children: ReactNode;
};

export function Screen({ classNames, name, noHeader, noPadding, children }: ScreenProps) {
  if (noHeader) {
    return (
      <SafeAreaView className={`${!noPadding && "w-full flex-1 px-4"} ${classNames}`}>
        {children}
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      className="min-h-full w-full"
    >
      <Appbar.Header mode="small">
        <Appbar.Content title={name} />
      </Appbar.Header>
      <View className={`${!noPadding && "px-4"} ${classNames}`}>{children}</View>
    </ScrollView>
  );
}
