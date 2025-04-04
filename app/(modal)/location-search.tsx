import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ListRenderItem,
} from "react-native";
import { useState } from "react";
import MapView from "react-native-maps";
import Colors from "@/constants/Colors";
import { useNavigation } from "expo-router";
import "react-native-get-random-values";
import { Ionicons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

type Place = {
  lat: number;
  lng: number;
  displayName: string;
};
interface APIResponse {
  results: {
    formatted: string;
    geometry: {
      lat: number;
      lng: number;
    };
  }[];
}

const LocationSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);

  const navigation = useNavigation();
  const [location, setLocation] = useState({
    latitude: 30.0393329,
    longitude: 31.3289253,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  // Fetch places from OpenCage Geocoder
  const fetchPlaces = async (query: string) => {
    if (!query) return;

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${process.env.EXPO_PUBLIC_OPENCAGE_API_KEY}`
      );
      const data: APIResponse = await response.json();
      const places: Place[] = data.results.map((place) => ({
        lat: place.geometry.lat,
        lng: place.geometry.lng,
        displayName: place.formatted,
      }));

      setPlaces(places);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const onPlaceSelect = (place: any) => {
    setLocation({
      latitude: place.lat,
      longitude: place.lng,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
    setSearchQuery(place.displayName);
    setPlaces([]);
  };

  const renderItem: ListRenderItem<Place> = ({ item, index }) => {
    if (!item || !item.displayName) {
      console.warn("Skipping undefined item:", item);
      return null; // Prevent rendering undefined items
    }
    return (
      <View style={styles.suggestionsContainer}>
        <TouchableOpacity
          key={index}
          onPress={() => onPlaceSelect(item)}
          style={styles.suggestionItem}
        >
          <Text>{item?.displayName}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.inputContainer}>
        <View>
          <Ionicons
            name="search"
            size={24}
            color={Colors.medium}
            style={styles.searchIcon}
          />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            fetchPlaces(text);
          }}
        />
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={() => {
            setSearchQuery("");
            setPlaces([]);
          }}
        >
          <Ionicons name="close-outline" size={18} color="#aaa" />
        </TouchableOpacity>
      </View>
      {places.length > 0 && (
        <FlatList
          data={places}
          renderItem={renderItem}
          style={{
            maxHeight: Math.min(places.length * 50, 200),
            backgroundColor: "#fff",
            overflow: "scroll",
          }}
          scrollEnabled={true}
        />
      )}

      <MapView style={styles.map} showsUserLocation={true} region={location} />
      <View style={styles.absoluteBox}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 16,
    padding: 8,
    position: "relative",
  },

  searchIcon: {
    position: "absolute",
    zIndex: 1,
    top: -12,
    left: 5,
  },

  searchInput: {
    height: 40,
    paddingHorizontal: 36,
    backgroundColor: Colors.grey,
    flex: 1,
    borderRadius: 8,
  },
  clearSearchButton: {
    backgroundColor: "#fff",
    borderRadius: 15,
    position: "absolute",
    right: 20,
  },
  suggestionsContainer: {
    marginTop: 4,
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1,
    backgroundColor: "#fff",
    overflow: "scroll",
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  map: {
    flex: 1,
  },
  absoluteBox: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    alignItems: "center",
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LocationSearch;

// ____________________________________________________________________________________
//  using GooglePlacesAutocomplete

// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

//  <GooglePlacesAutocomplete
//       placeholder="Search"
//        fetchDetails={true}
//       onPress={(data, details) => {
//      const point=details.geometry.location;
//      if(!point) return;
//        setLocation({
//         ..location
//          latitude: point.lat,
//          longitude: point.lng,
//       })}}
//       query={{
//         key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
//         language: "en",
//       }}

//       renderLeftButto={()=><Ionicons name="search" size={24} color={Colors.medium} style={{marginLeft:16}}/>}
//       styles={{
//         container:{
//         flex:0
//         },
//         textInput:{
//           backgroundColor:Colors.grey,
//           paddingLeft:35,
//           borddrRadius:10
//         },
//         textInputContainer:{
//           padding:8,
//           backgroundColor:#fff
//         }
//        }}
//     />
