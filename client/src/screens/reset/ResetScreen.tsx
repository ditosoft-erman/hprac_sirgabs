import { View, Text, ActivityIndicator, Dimensions } from "react-native";
import React, { useState } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Pressable, TextInput } from "react-native-gesture-handler";
import Button from "@/src/components/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios"; // To make API calls
import api from "@/utils/api";

const { width, height } = Dimensions.get("window");

const CodeScreen = () => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const { navigate: navigateAuth }: NavigationProp<AuthNavigationType> =
    useNavigation();

  const handleResetPassword = async () => {
    if (!code || !password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/auth/verify-otp", {
        email: "remotask0928@gmail.com", // Replace with actual email
        otp: code,
        newPassword: password,
      });

      if (response.data.success) {
        alert("Password has been reset successfully");
        setIsLoading(false);
        navigateAuth("Login");
      } else {
        setIsLoading(false);
        alert(
          response.data.message || "Invalid OTP or failed to reset password"
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error resetting password:", error.response || error);
      alert(
        error.response?.data?.message ||
          "Error resetting password, please try again"
      );
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
              Enter code and password to reset!
            </Text>
          </Animated.View>

          <Animated.View
            className="py-8 space-y-8"
            entering={FadeInDown.duration(100).delay(200).springify()}
          >
            <View className="border-2 border-gray-400 rounded-lg">
              <TextInput
                className="p-4"
                onChangeText={(text) => setCode(text)}
                value={code}
                keyboardType="numeric"
                placeholder="Enter Code"
                autoCapitalize="none"
              />
            </View>
            <View className="border-2 border-gray-400 rounded-lg">
              <TextInput
                className="p-4"
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder="New Password"
                autoCapitalize="none"
                secureTextEntry
              />
            </View>
          </Animated.View>

          <Animated.View
            className="w-full justify-start"
            entering={FadeInDown.duration(100).delay(300).springify()}
          >
            <View className="pb-6">
              <Button title={"Reset Password"} action={handleResetPassword} />
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default CodeScreen;
