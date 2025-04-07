import "react-native-reanimated";
import "react-native-gesture-handler";

import CustomHeader from "@/components/CustomHeader";
import { Stack, useNavigation } from "expo-router";
import React from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { Alert, Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
  const navigation = useNavigation();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              header: () => <CustomHeader />,
            }}
          />
          <Stack.Screen
            name="(modal)/filter"
            options={{
              presentation: "modal",
              headerTitle: "Filter",
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: Colors.lightGrey,
              },
              headerLeft: () =>
                Platform.OS === "ios" ? (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                      name="close-outline"
                      size={28}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                ) : null,
            }}
          />
          <Stack.Screen
            name="(modal)/location-search"
            options={{
              presentation: "fullScreenModal",
              headerTitle: "Select location",
              headerLeft: () =>
                Platform.OS === "ios" ? (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                      name="close-outline"
                      size={28}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                ) : null,
            }}
          />
          <Stack.Screen
            name="(modal)/dish"
            options={{
              presentation: "modal",
              headerTitle: "",
              headerTransparent: true,
              headerLeft: () =>
                Platform.OS === "ios" ? (
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 20,
                      padding: 6,
                    }}
                  >
                    <Ionicons
                      name="close-outline"
                      size={28}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                ) : null,
            }}
          />
          <Stack.Screen
            name="basket"
            options={{
              headerTitle: "Basket",
              headerTitleAlign: Platform.OS === "ios" ? "center" : "left",

              headerLeft: () =>
                Platform.OS === "ios" ? (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                      name="arrow-back"
                      size={28}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                ) : null,
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
