import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
