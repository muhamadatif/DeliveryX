import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { styles } from "@/styles/header.styles";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import SearchBar from "./SearchBar";

const CustomHeader = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity>
          <Image
            source={require("@/assets/images/bike.png")}
            style={styles.bike}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.titleContainer}>
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
