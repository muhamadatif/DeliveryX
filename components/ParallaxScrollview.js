import React, { useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";

const window = Dimensions.get("window");

const pivotPoint = (a, b) => a - b;
const renderEmpty = () => <View />;
const noRender = () => <View style={{ display: "none" }} />;

const interpolate = (value, opts) => {
  const x = value.interpolate(opts);
  x.toJSON = () => x.__getValue?.() ?? 0;
  return x;
};

/**
 * @typedef {Object} ParallaxScrollViewProps
 * @property {() => JSX.Element=} renderStickyHeader
 */

/**
 * @param {ParallaxScrollViewProps & any} props
 */

const ParallaxScrollView = ({
  backgroundScrollSpeed = 5,
  backgroundColor = "#000",
  contentBackgroundColor = "#fff",
  fadeOutForeground = true,
  fadeOutBackground = false,
  onChangeHeaderVisibility = () => {},
  parallaxHeaderHeight,
  renderScrollComponent = (props) => <Animated.ScrollView {...props} />,
  renderBackground = renderEmpty,
  renderContentBackground = noRender,
  renderForeground = renderEmpty,
  renderStickyHeader = null,
  renderFixedHeader = null,
  stickyHeaderHeight = 0,
  contentContainerStyle = null,
  outputScaleValue = 5,
  parallaxHeaderContainerStyle = null,
  parallaxHeaderStyle = null,
  backgroundImageStyle = null,
  stickyHeaderStyle = null,
  scrollEvent = null,
  onScroll: onScrollProp = null,
  children,
  style,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const footerRef = useRef(null);

  const [viewSize, setViewSize] = useState({
    viewWidth: window.width,
    viewHeight: window.height,
  });

  const p = pivotPoint(parallaxHeaderHeight, stickyHeaderHeight);

  const onScroll = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    scrollEvent?.(e);
    onScrollProp?.(e);

    onChangeHeaderVisibility?.(offsetY < p);
  };

  const animatedOnScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: onScroll,
    }
  );

  const updateLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== viewSize.viewWidth || height !== viewSize.viewHeight) {
      setViewSize({ viewWidth: width, viewHeight: height });
    }
  };

  const renderBg = () => (
    <Animated.View
      style={[
        styles.backgroundImage,
        backgroundImageStyle,
        {
          backgroundColor,
          height: parallaxHeaderHeight,
          width: viewSize.viewWidth,
          opacity: fadeOutBackground
            ? interpolate(scrollY, {
                inputRange: [0, p * 0.5, p * 0.75, p],
                outputRange: [1, 0.3, 0.1, 0],
                extrapolate: "clamp",
              })
            : 1,
          transform: [
            {
              translateY: interpolate(scrollY, {
                inputRange: [0, p],
                outputRange: [0, -(p / backgroundScrollSpeed)],
                extrapolate: "clamp",
              }),
            },
            {
              scale: interpolate(scrollY, {
                inputRange: [-viewSize.viewHeight, 0],
                outputRange: [outputScaleValue * 1.5, 1],
                extrapolate: "clamp",
              }),
            },
          ],
        },
      ]}
    >
      <View>{renderBackground()}</View>
    </Animated.View>
  );

  const renderFg = () => (
    <View
      style={[styles.parallaxHeaderContainer, parallaxHeaderContainerStyle]}
    >
      <Animated.View
        style={[
          styles.parallaxHeader,
          parallaxHeaderStyle,
          {
            height: parallaxHeaderHeight,
            opacity: fadeOutForeground
              ? interpolate(scrollY, {
                  inputRange: [0, p * 0.5, p * 0.75, p],
                  outputRange: [1, 0.3, 0.1, 0],
                  extrapolate: "clamp",
                })
              : 1,
          },
        ]}
      >
        <View style={{ height: parallaxHeaderHeight }}>
          {renderForeground()}
        </View>
      </Animated.View>
    </View>
  );

  const renderSticky = () => {
    if (!renderStickyHeader && !renderFixedHeader) return null;

    return (
      <View
        style={[
          styles.stickyHeader,
          stickyHeaderStyle,
          { width: viewSize.viewWidth, height: stickyHeaderHeight },
        ]}
      >
        {renderStickyHeader && (
          <Animated.View
            style={{
              backgroundColor,
              height: stickyHeaderHeight,
              opacity: interpolate(scrollY, {
                inputRange: [0, p],
                outputRange: [0, 1],
                extrapolate: "clamp",
              }),
            }}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    translateY: interpolate(scrollY, {
                      inputRange: [0, p],
                      outputRange: [stickyHeaderHeight, 0],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              }}
            >
              {renderStickyHeader()}
            </Animated.View>
          </Animated.View>
        )}
        {renderFixedHeader && renderFixedHeader()}
      </View>
    );
  };

  const bodyContent = (
    <View
      style={[
        {
          backgroundColor: contentBackgroundColor,
          minHeight: viewSize.viewHeight,
        },
        contentContainerStyle,
      ]}
      onLayout={(e) => {
        const { height } = e.nativeEvent.layout;
        const footerHeight = Math.max(
          0,
          viewSize.viewHeight - height - stickyHeaderHeight
        );
        footerRef.current?.setNativeProps?.({
          style: { height: footerHeight },
        });
      }}
    >
      {renderContentBackground()}
      {children}
    </View>
  );

  const footerSpacer = (
    <View ref={footerRef} style={{ backgroundColor: contentBackgroundColor }} />
  );

  const scrollComponent = renderScrollComponent({
    ref: scrollRef,
    scrollEventThrottle: 1,
    onScroll: animatedOnScroll,
    style: styles.scrollView,
  });

  return (
    <View style={[styles.container, style]} onLayout={updateLayout}>
      {renderBg()}
      {React.cloneElement(
        scrollComponent,
        {},
        renderFg(),
        bodyContent,
        footerSpacer
      )}
      {renderSticky()}
    </View>
  );
};

ParallaxScrollView.propTypes = {
  backgroundColor: PropTypes.string,
  backgroundScrollSpeed: PropTypes.number,
  fadeOutForeground: PropTypes.bool,
  fadeOutBackground: PropTypes.bool,
  contentBackgroundColor: PropTypes.string,
  onChangeHeaderVisibility: PropTypes.func,
  parallaxHeaderHeight: PropTypes.number.isRequired,
  renderBackground: PropTypes.func,
  renderContentBackground: PropTypes.func,
  renderFixedHeader: PropTypes.func,
  renderForeground: PropTypes.func,
  renderScrollComponent: PropTypes.func,
  renderStickyHeader: PropTypes.func,
  stickyHeaderHeight: PropTypes.number,
  contentContainerStyle: PropTypes.any,
  outputScaleValue: PropTypes.number,
  parallaxHeaderContainerStyle: PropTypes.any,
  parallaxHeaderStyle: PropTypes.any,
  backgroundImageStyle: PropTypes.any,
  stickyHeaderStyle: PropTypes.any,
  scrollEvent: PropTypes.func,
  onScroll: PropTypes.func,
  children: PropTypes.node,
  style: PropTypes.any,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  parallaxHeaderContainer: {
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  parallaxHeader: {
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  scrollView: {
    backgroundColor: "transparent",
  },
});

export default ParallaxScrollView;
