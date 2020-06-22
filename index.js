import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const DoubleClick = (props) => {
  const delayTime = props.delay ? props.delay : 300;
  const [firstPress, setFirstPress] = useState(true);
  const [lastTime, setLastTime] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  let timer = false;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeout = props.timeout ? props.timeout : 1000;
  useEffect(() => {
    if (modalVisible) {
      fadeIn();
      setTimeout(() => {
        fadeOut();
      }, timeout);
      setModalVisible(false);
    }
  }, [fadeIn, fadeOut, modalVisible]);

  useEffect(() => {
    if (timer) clearTimeout(timer);
  }, [timer]);

  const onPress = () => {
    const now = new Date().getTime();

    if (firstPress) {
      setFirstPress(false);

      timer = setTimeout(() => {
        setFirstPress(true);
      }, delayTime);

      setLastTime(now);
    } else if (now - lastTime < delayTime) {
      setModalVisible(true);
      if (timer) clearTimeout(timer);
      props.doubleClick();
      setFirstPress(true);
    }
  };

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
    }).start();
  }, [fadeAnim]);

  const fadeOut = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
    }).start();
  }, [fadeAnim]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      {props.icon && (
        <View>
          <Animated.View
            style={{
              opacity: fadeAnim,
              ...styles.favoriteIcon,
            }}
          >
            <MaterialIcons
              name="favorite"
              size={120}
              color="rgba(255, 102, 102, 0.88)"
            />
          </Animated.View>
          {props.children}
        </View>
      )}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  favoriteIcon: {
    position: "absolute",
    zIndex: 10,
    marginTop: Dimensions.get("window").width * 0.5 - 60,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DoubleClick;
