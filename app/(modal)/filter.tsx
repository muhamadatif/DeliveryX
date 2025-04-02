import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import categories from "@/assets/data/filter.json";
import { styles } from "@/styles/filter.styles";
import ItemBox from "@/components/ItemBox";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Colors from "@/constants/Colors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Category {
  name: string;
  count: number;
  checked?: boolean;
}

const Filter = () => {
  const [items, setItems] = useState<Category[]>(categories);
  const [selected, setSelected] = useState<Category[]>([]);
  const navigation = useNavigation();
  const flexWidth = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const hasSelected = selected.length > 0;
    const selectedItems = items.filter((item) => item.checked);
    const newSelected = selectedItems.length > 0;
    if (hasSelected !== newSelected) {
      flexWidth.value = withTiming(newSelected ? 150 : 0);
      scale.value = withTiming(newSelected ? 1 : 0);
    }
    setSelected(selectedItems);
  }, [items]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: flexWidth.value,
      transform: [{ scale: flexWidth.value > 0 ? 1 : 0 }],
      // opacity: flexWidth.value > 0 ? 1 : 0,
    };
  });
  const animatedText = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleClearAll = () => {
    const updatedItems = items.map((item) => {
      item.checked = false;
      return item;
    });
    setItems(updatedItems);
  };
  const renderItem: ListRenderItem<Category> = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.itemText}>
        {item.name} ({item.count})
      </Text>
      <View>
        <BouncyCheckbox
          fillColor={Colors.primary}
          unFillColor="#fff"
          isChecked={items[index].checked}
          iconStyle={{
            borderColor: Colors.primary,
            borderRadius: 4,
          }}
          innerIconStyle={{
            borderColor: Colors.primary,
            borderRadius: 4,
            borderWidth: 2,
          }}
          onPress={() => {
            const isChecked = items[index].checked;
            const updatedItems = items.map((item) => {
              if (item.name === items[index].name) {
                item.checked = !isChecked;
              }
              return item;
            });
            setItems(updatedItems);
          }}
        />
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        ListHeaderComponent={ItemBox}
      />
      <View style={{ height: 76 }} />
      <View style={styles.footer}>
        <View style={styles.btnContainer}>
          <Animated.View style={[animatedStyles, styles.outlineButton]}>
            <TouchableOpacity onPress={handleClearAll}>
              <Animated.Text style={[animatedText, styles.outlineButtonText]}>
                Clear all
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity
            style={styles.fullButton}
            onPress={() => navigation.goBack()}
          >
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Filter;
