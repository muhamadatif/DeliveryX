import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export type Ref = BottomSheetModal;
const BottomSheet = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ["50%"], []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const { dismiss } = useBottomSheetModal();
  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      overDragResistanceFactor={0}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ borderRadius: 0, backgroundColor: Colors.lightGrey }}
      handleIndicatorStyle={{ display: "none" }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.toggle}>
          <TouchableOpacity style={styles.toggleActive}>
            <Text style={styles.activeText}>Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleInactive}>
            <Text style={styles.inactiveText}>Pickup</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subheader}>Your Location</Text>
        <Link href={"/"} asChild>
          <TouchableOpacity>
            <View style={styles.item}>
              <Ionicons
                name="location-outline"
                size={20}
                color={Colors.medium}
              />
              <Text style={{ flex: 1 }}>Current location</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.primary}
              />
            </View>
          </TouchableOpacity>
        </Link>
        <Text style={styles.subheader}>Arrival time</Text>
        <TouchableOpacity>
          <View style={styles.item}>
            <Ionicons
              name="stopwatch-outline"
              size={20}
              color={Colors.medium}
            />
            <Text style={{ flex: 1 }}>Now</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => dismiss()}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  toggle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
  },
  toggleActive: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 32,
    paddingHorizontal: 30,
  },
  activeText: {
    color: "#fff",
    fontWeight: "700",
  },
  toggleInactive: {
    padding: 8,
    borderRadius: 32,
    paddingHorizontal: 30,
  },
  inactiveText: {
    color: Colors.primary,
    fontWeight: "700",
  },

  subheader: {
    fontSize: 16,
    fontWeight: "600",
    margin: 16,
  },

  item: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderColor: Colors.grey,
    borderWidth: 1,
  },

  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 4,
    margin: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
export default BottomSheet;
