import { View, Text, ActivityIndicator, Dimensions, Alert } from "react-native";
import React, { useState } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Pressable, TextInput } from "react-native-gesture-handler";
import Button from "@/src/components/Button";
import Breaker from "@/src/components/Breaker";
import ButtonOutlines from "@/src/components/ButtonOutlines";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import api from "@/utils/api"; // Path to your Axios utility

const { width, height } = Dimensions.get("window");

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<AuthNavigationType>>();

  const { navigate: navigateAuth }: NavigationProp<AuthNavigationType> =
    useNavigation();

  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for validating email

    if (!name || !email || !password || !confirmpass) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (password !== confirmpass) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", {
        username: name,
        email,
        password,
      });
      Alert.alert("Success", response.data.message);
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Registration failed"
      );
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

      <View className="justify-center items-center relative flex-1">
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
              style={{
                fontFamily: "PlusJakartaSansBold",
              }}
            >
              Register to join Us!
            </Text>

            <Text className="text-neutral-500 text-sm font-medium">
              Welcome! Please enter your details.
            </Text>
          </Animated.View>

          <Animated.View
            className="py-8 space-y-8"
            entering={FadeInDown.duration(100).delay(200).springify()}
          >
            <View className="border-2 border-gray-400 rounded-lg">
              <TextInput
                className="p-4"
                onChangeText={(text) => setName(text)}
                value={name}
                placeholder="Name"
                autoCapitalize="none"
              />
            </View>
            <View className="border-2 border-gray-400 rounded-lg">
              <TextInput
                className="p-4"
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="Email"
                autoCapitalize="none"
              />
            </View>

            {/* Password Field */}
            <View className="border-2 border-gray-400 rounded-lg flex-row items-center">
              <TextInput
                className="flex-1 p-4"
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry={!showPassword}
              />
              <Pressable
                className="px-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="gray"
                />
              </Pressable>
            </View>

            <View className="border-2 border-gray-400 rounded-lg flex-row items-center">
              <TextInput
                className="flex-1 p-4"
                onChangeText={(text) => setConfirmPass(text)}
                value={confirmpass}
                placeholder="Confirm Password"
                autoCapitalize="none"
                secureTextEntry={!showConfirmPassword}
              />
              <Pressable
                className="px-3"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color="gray"
                />
              </Pressable>
            </View>
          </Animated.View>

          <Animated.View
            className="w-full justify-start"
            entering={FadeInDown.duration(100).delay(300).springify()}
          >
            <View className="pb-6">
              <Button title={"Register"} action={handleRegister} />
            </View>
          </Animated.View>
          {/* 
          <View>
            <Breaker />
          </View>

          <View className="w-full justify-normal">
            <Animated.View
              entering={FadeInDown.duration(100).delay(600).springify()}
              className="pb-4"
            >
              <ButtonOutlines title="Continue with Google">
                <AntDesign name="google" size={20} color="gray" />
              </ButtonOutlines>
            </Animated.View>
          </View> */}

          <Animated.View
            className="flex-row justify-center items-center"
            entering={FadeInDown.duration(100).delay(700).springify()}
          >
            <Text
              className="text-neutral-500 text-lg font-medium leading-[38px] text-center"
              style={{
                fontFamily: "PlusJakartaSansMedium",
              }}
            >
              Already have an account?
            </Text>
            <Pressable onPress={() => navigateAuth("Login")}>
              <Text
                className="px-1 text-neutral-800 text-lg font-medium leading-[38px] text-center"
                style={{
                  fontFamily: "PlusJakartaSansMedium",
                }}
              >
                Login
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;
