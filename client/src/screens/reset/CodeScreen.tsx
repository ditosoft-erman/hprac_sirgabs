import { View, Text, ActivityIndicator, Dimensions } from "react-native";
import React, { useState } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Pressable, TextInput } from "react-native-gesture-handler";
import Button from "@/src/components/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios"; // Use Axios to handle HTTP requests
import api from "@/utils/api"; // Assuming your api.js config file

const { width, height } = Dimensions.get("window");

const CodeScreen = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const { navigate: navigateAuth }: NavigationProp<AuthNavigationType> =
    useNavigation();

  const handleSendCode = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/send-code", {
        email,
      });

      alert(response.data.message); // Notify the user that the OTP was sent
      navigateAuth("Reset"); // Navigate to reset screen
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

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

      <SafeAreaView>
        <View className="flex-row justify-start items-center px-4 py-4">
          <View className="border-2 border-neutral-500 rounded-full p-1">
            <Pressable onPress={() => navigation.goBack()}>
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                color="gray"
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <View className="justify-center items-center relative flex">
        <View
          className="justify-center w-full px-4"
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
              style={{ fontFamily: "PlusJakartaSansBold" }}
            >
              Reset Password
            </Text>

            <Text className="text-neutral-500 text-sm font-medium">
              Enter your email to send code!
            </Text>
          </Animated.View>

          <Animated.View
            className="py-8 space-y-8"
            entering={FadeInDown.duration(100).delay(200).springify()}
          >
            <View className="border-2 border-gray-400 rounded-lg">
              <TextInput
                className="p-4"
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="Email"
                autoCapitalize="none"
              />
            </View>
          </Animated.View>

          <Animated.View
            className="w-full justify-start"
            entering={FadeInDown.duration(100).delay(300).springify()}
          >
            <View className="pb-6">
              <Button title={"Send Code"} action={handleSendCode} />
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default CodeScreen;
