import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useRef } from "react";
import { styles } from "@/styles/header.styles";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import SearchBar from "./SearchBar";
import BottomSheetComponent from "./BottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const CustomHeader = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openModal = () => {
    bottomSheetRef.current?.present();
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <BottomSheetComponent ref={bottomSheetRef} />
      <View style={styles.container}>
        <TouchableOpacity onPress={openModal}>
          <Image
            source={require("@/assets/images/bike.png")}
            style={styles.bike}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.titleContainer} onPress={openModal}>
          <Text style={styles.title}>Delivery · Now</Text>
          <View style={styles.location}>
            <Text style={styles.subtitle}>Cairo</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.primary} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileButton}>
          <Text>
            <Ionicons name="person-outline" size={20} color={Colors.primary} />
          </Text>
        </TouchableOpacity>
      </View>
      <SearchBar />
    </SafeAreaView>
  );
};

export default CustomHeader;
