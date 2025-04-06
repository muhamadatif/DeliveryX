import React, { useLayoutEffect, useRef, useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollview";
import {
  Image,
  ListRenderItem,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "@/constants/Colors";
import { restaurant } from "@/assets/data/restaurant";
import { Link, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { styles } from "@/styles/details.styles";
import useBasketStore from "@/store/basketStore";
import { SafeAreaView } from "react-native-safe-area-context";

const Details = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const { items, total } = useBasketStore();

  const opacity = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const onScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y > 350) {
      opacity.value = withTiming(1);
    } else {
      opacity.value = withTiming(0);
    }
  };

  const scrollRef = useRef<ScrollView>(null);
  const itemRef = useRef<
    Array<React.ElementRef<typeof TouchableOpacity> | null>
  >([]);

  const selectCategory = (index: number) => {
    const selected = itemRef.current[index];
    setActiveIndex(index);

    selected?.measure((x) => {
      scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
    });
  };

  const DATA = restaurant.food.map((item, index) => ({
    title: item.category,
    data: item.meals,
    index,
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary,
      headerLeft: () => (
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="share-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="search-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      ),
    });
  });

  const renderItem: ListRenderItem<any> = ({ item, index }) => (
    <Link href={{ pathname: "/(modal)/dish", params: { id: item.id } }} asChild>
      <TouchableOpacity style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.dishName}>{item.name}</Text>
          <Text style={styles.dishText}>{item.info}</Text>
          <Text style={styles.dishText}>${item.price}</Text>
        </View>
        <Image source={item.img} style={styles.dishImage} />
      </TouchableOpacity>
    </Link>
  );
  return (
    <>
      <ParallaxScrollView
        scrollEvent={onScroll}
        backgroundColor={"#fff"}
        style={{ flex: 1 }}
        parallaxHeaderHeight={250}
        renderBackground={() => (
          <Image
            source={restaurant.img}
            style={{ width: "100%", height: 300 }}
          />
        )}
        stickyHeaderHeight={100}
        contentBackgroundColor={Colors.lightGrey}
        renderStickyHeader={() => (
          <View key={"sticky-header"} style={styles.stickySection}>
            <Text style={styles.stickySectionText}>{restaurant.name}</Text>
          </View>
        )}
      >
        <View style={styles.detailsContainer}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantDescription}>
            {restaurant.delivery} ·{" "}
            {restaurant.tags.map(
              (tag, index) =>
                `${tag}${index < restaurant.tags.length - 1 ? " · " : ""}`
            )}
          </Text>
          <Text style={styles.restaurantAbout}>{restaurant.about}</Text>
          <SectionList
            contentContainerStyle={{ paddingBottom: 50 }}
            keyExtractor={(item, index) => `${item.id + index}`}
            scrollEnabled={false} // parallax scroll view handles the scroll
            sections={DATA}
            renderSectionHeader={({ section: { title, index } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  marginHorizontal: 16,
                  height: 1,
                  backgroundColor: Colors.grey,
                }}
              />
            )}
            SectionSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: Colors.grey }} />
            )}
          />
        </View>
      </ParallaxScrollView>

      {/* Sticky segments */}
      <Animated.View style={[styles.stickySegments, animatedStyles]}>
        <View style={styles.segmentsShadow}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.segmentScrollView}
          >
            {restaurant.food.map((item, index) => (
              <TouchableOpacity
                ref={(ref) => (itemRef.current[index] = ref!)}
                key={index}
                style={
                  activeIndex === index
                    ? styles.segmentButtonActive
                    : styles.segmentButton
                }
                onPress={() => selectCategory(index)}
              >
                <Text
                  style={
                    activeIndex === index
                      ? styles.segmentTextActive
                      : styles.segmentText
                  }
                >
                  {item.category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      {/* Footer Basket */}
      {items > 0 && (
        <View style={styles.footer}>
          <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#fff" }}>
            <Link href="/" asChild>
              <TouchableOpacity style={styles.fullButton}>
                <Text style={styles.basket}>{items}</Text>
                <Text style={styles.footerText}>View Basket</Text>
                <Text style={styles.basketTotal}>Total: ${total}</Text>
              </TouchableOpacity>
            </Link>
          </SafeAreaView>
        </View>
      )}
    </>
  );
};

export default Details;

// import React, { useLayoutEffect, useRef, useState } from "react";
// import {
//   Image,
//   ListRenderItem,
//   ScrollView,
//   SectionList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ViewToken,
//   NativeScrollEvent,
//   NativeSyntheticEvent,
// } from "react-native";
// import Colors from "@/constants/Colors";
// import { restaurant } from "@/assets/data/restaurant";
// import { Link, useNavigation } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";

// const Details = () => {
//   const navigation = useNavigation();
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isManualScroll, setIsManualScroll] = useState(false);

//   const opacity = useSharedValue(0);
//   const animatedStyles = useAnimatedStyle(() => ({
//     opacity: opacity.value,
//   }));

//   const horizontalScrollRef = useRef<ScrollView>(null);
//   const mainScrollRef = useRef<ScrollView>(null);
//   const itemRefs = useRef<
//     Array<React.ElementRef<typeof TouchableOpacity> | null>
//   >([]);

//   const sectionPositions = useRef<number[]>([]);
//   const scrollPosition = useRef(0);

//   const DATA = restaurant.food.map((item, index) => ({
//     title: item.category,
//     data: item.meals,
//     index,
//   }));

//   const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const y = event.nativeEvent.contentOffset.y;
//     scrollPosition.current = y;

//     if (y > 350) {
//       opacity.value = withTiming(1);
//     } else {
//       opacity.value = withTiming(0);
//     }

//     // Only update active index if not from manual scroll
//     if (!isManualScroll) {
//       for (let i = sectionPositions.current.length - 1; i >= 0; i--) {
//         if (y >= sectionPositions.current[i] - 100) {
//           setActiveIndex(i);
//           break;
//         }
//       }
//     }
//   };

//   const selectCategory = (index: number) => {
//     const selected = itemRefs.current[index];
//     setActiveIndex(index);
//     setIsManualScroll(true);

//     // Scroll horizontal menu
//     selected?.measure((x) => {
//       horizontalScrollRef.current?.scrollTo({
//         x: x - 16,
//         y: 0,
//         animated: true,
//       });
//     });

//     // Scroll to section
//     if (sectionPositions.current[index] !== undefined) {
//       mainScrollRef.current?.scrollTo({
//         y: sectionPositions.current[index],
//         animated: true,
//       });
//     }

//     // Reset manual scroll flag after animation would complete
//     setTimeout(() => setIsManualScroll(false), 500);
//   };

//   const handleViewableItemsChanged = ({
//     viewableItems,
//   }: {
//     viewableItems: ViewToken[];
//   }) => {
//     if (
//       !isManualScroll &&
//       viewableItems.length > 0 &&
//       viewableItems[0].section
//     ) {
//       const sectionIndex = viewableItems[0].section.index;
//       if (sectionIndex !== activeIndex) {
//         setActiveIndex(sectionIndex);
//       }
//     }
//   };

//   // Calculate section positions after layout
//   const onLayout = () => {
//     // Approximate heights:
//     const headerHeight = 250; // Image height
//     const restaurantInfoHeight = 200; // Name + description + about

//     let position = headerHeight + restaurantInfoHeight;

//     DATA.forEach((section, index) => {
//       sectionPositions.current[index] = position;
//       // Add section header height
//       position += 60;
//       // Add items height (approx 100 per item)
//       position += section.data.length * 100;
//     });
//   };

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTransparent: true,
//       headerTitle: "",
//       headerTintColor: Colors.primary,
//       headerLeft: () => (
//         <TouchableOpacity
//           style={styles.roundButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Ionicons name="arrow-back" size={24} color={Colors.primary} />
//         </TouchableOpacity>
//       ),
//       headerRight: () => (
//         <View style={styles.bar}>
//           <TouchableOpacity style={styles.roundButton}>
//             <Ionicons name="share-outline" size={24} color={Colors.primary} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.roundButton}>
//             <Ionicons name="search-outline" size={24} color={Colors.primary} />
//           </TouchableOpacity>
//         </View>
//       ),
//     });
//   }, []);

//   const renderItem: ListRenderItem<any> = ({ item }) => (
//     <Link href={"/"} asChild>
//       <TouchableOpacity style={styles.item}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.dishName}>{item.name}</Text>
//           <Text style={styles.dishText}>{item.info}</Text>
//           <Text style={styles.dishText}>${item.price}</Text>
//         </View>
//         <Image source={item.img} style={styles.dishImage} />
//       </TouchableOpacity>
//     </Link>
//   );

//   return (
//     <>
//       <ScrollView
//         ref={mainScrollRef}
//         onScroll={onScroll}
//         scrollEventThrottle={16}
//         style={{ flex: 1 }}
//         contentContainerStyle={{ backgroundColor: Colors.lightGrey }}
//       >
//         <View style={styles.detailsContainer} onLayout={onLayout}>
//           <Image
//             source={restaurant.img}
//             style={{ width: "100%", height: 250 }}
//           />
//           <Text style={styles.restaurantName}>{restaurant.name}</Text>
//           <Text style={styles.restaurantDescription}>
//             {restaurant.delivery} ·{" "}
//             {restaurant.tags.map(
//               (tag, index) =>
//                 `${tag}${index < restaurant.tags.length - 1 ? " · " : ""}`
//             )}
//           </Text>
//           <Text style={styles.restaurantAbout}>{restaurant.about}</Text>

//           <SectionList
//             contentContainerStyle={{ paddingBottom: 50 }}
//             keyExtractor={(item, index) => `${item.id + index}`}
//             scrollEnabled={false}
//             sections={DATA}
//             renderSectionHeader={({ section: { title, index } }) => (
//               <Text style={styles.sectionHeader}>{title}</Text>
//             )}
//             renderItem={renderItem}
//             ItemSeparatorComponent={() => (
//               <View
//                 style={{
//                   marginHorizontal: 16,
//                   height: 1,
//                   backgroundColor: Colors.grey,
//                 }}
//               />
//             )}
//             SectionSeparatorComponent={() => (
//               <View style={{ height: 1, backgroundColor: Colors.grey }} />
//             )}
//             onViewableItemsChanged={handleViewableItemsChanged}
//             viewabilityConfig={{
//               itemVisiblePercentThreshold: 50,
//               minimumViewTime: 100,
//             }}
//           />
//         </View>
//       </ScrollView>

//       <Animated.View style={[styles.stickySegments, animatedStyles]}>
//         <View style={styles.segmentsShadow}>
//           <ScrollView
//             ref={horizontalScrollRef}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.segmentScrollView}
//           >
//             {DATA.map((section, index) => (
//               <TouchableOpacity
//                 ref={(ref) => (itemRefs.current[index] = ref)}
//                 key={index}
//                 style={
//                   activeIndex === index
//                     ? styles.segmentButtonActive
//                     : styles.segmentButton
//                 }
//                 onPress={() => selectCategory(index)}
//               >
//                 <Text
//                   style={
//                     activeIndex === index
//                       ? styles.segmentTextActive
//                       : styles.segmentText
//                   }
//                 >
//                   {section.title}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </Animated.View>
//     </>
//   );
// };
