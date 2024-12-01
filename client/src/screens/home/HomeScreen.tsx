import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  Alert,
  BackHandler,
} from "react-native";
import React, { useState, useEffect } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Pressable } from "react-native-gesture-handler";
import Button from "@/src/components/Button";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { CommonActions } from "@react-navigation/native"; // Import CommonActions for reset

const { width, height } = Dimensions.get("window");

const RegisterScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    navigate: navigateLogin,
    dispatch,
  }: NavigationProp<AuthNavigationType> = useNavigation();

  // Logout function
  const logout = async () => {
    setIsLoading(true); // Show loading spinner during logout

    try {
      // Remove user token from AsyncStorage
      await AsyncStorage.removeItem("userToken"); // Replace "userToken" with your key
      // Optionally, clear other user-related data if necessary
    } catch (error) {
      console.error("Error during logout", error);
    } finally {
      setIsLoading(false);

      // Reset navigation stack to the login screen
      dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }], // Replace "Login" with your login screen's name
        })
      );
    }
  };

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert(
          "Confirm Exit",
          "Are you sure you want to exit the app?",
          [
            {
              text: "Cancel",
              onPress: () => null, // Do nothing and stay on the current screen
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => BackHandler.exitApp(), // Exit the app
            },
          ],
          { cancelable: true }
        );
        return true; // Prevent the default behavior of going back
      }
    );

    // Cleanup on component unmount
    return () => backHandler.remove();
  }, []);

  return (
    <View className="flex-1">
      {isLoading && (
        <View className="absolute z-50 h-full w-full justify-center items-center">
          <View className="h-full w-full justify-center items-center bg-black opacity-[0.45]"></View>
          <View className="absolute">
            <ActivityIndicator size="large" color="white" />
          </View>
        </View>
      )}

      <View className="justify-center items-center relative flex-1">
        <View
          className="justify-center w-full px-4 space-y-4"
          style={{
            height: height * 0.75,
          }}
        >
          <Animated.View
            className="justify-center items-center"
            entering={FadeInDown.duration(100).springify()}
          >
            <Text
              className="text-neutral-800 text-2xl leading-[60px]"
              style={{
                fontFamily: "PlusJakartaSansBold",
              }}
            >
              What do you want to do?
            </Text>
          </Animated.View>

          <Animated.View
            className="w-full justify-start"
            entering={FadeInDown.duration(100).delay(300).springify()}
          >
            <View className="pb-6">
              <Pressable onPress={() => navigateLogin("User")}>
                <Button title={"View User"} />
              </Pressable>
            </View>
            <View className="pb-6">
              <Pressable onPress={logout}>
                <Button title={"Logout"} />
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;
