import { View, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { styles } from "@/styles/searchBar.styles";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const SearchBar = () => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchSection}>
        <View style={styles.searchField}>
          <Ionicons
            style={styles.searchIcon}
            name="search"
            size={20}
            color={Colors.medium}
          />
          <TextInput
            style={styles.input}
            placeholder="Resturants, groceries, dishes"
          />
        </View>
        <Link href="/filter" asChild>
          <TouchableOpacity style={styles.optionButton}>
            <Ionicons name="options-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default SearchBar;
