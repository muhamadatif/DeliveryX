import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import Categories from "@/components/Categories";
import { SafeAreaView } from "react-native-safe-area-context";
import Resturants from "@/components/Resturants";
import Colors from "@/constants/Colors";

const page = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 50,
        }}
      >
        <Categories />
        <Text style={styles.header}>Top picks in your neighbourhood</Text>
        <Resturants />
        <Text style={styles.header}>Offers near you</Text>
        <Resturants />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 50,
    backgroundColor: Colors.lightGrey,
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
});

export default page;
