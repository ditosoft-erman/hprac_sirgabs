import { View, Text, ActivityIndicator, Dimensions, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Pressable, TextInput } from "react-native-gesture-handler";
import Button from "@/src/components/Button";
import Breaker from "@/src/components/Breaker";
import ButtonOutlines from "@/src/components/ButtonOutlines";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import api from "@/utils/api";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get("window");

const androidClientId =
  "146971623954-mfag3v32iu3gjup93714os78668spuk6.apps.googleusercontent.com";
const iosClientId =
  "146971623954-760gvjv8srtvnl8sau0ufiin8cvqqulm.apps.googleusercontent.com";
const googleClientId =
  "146971623954-0971bhng9tirr546cjjjjgpr7f9tsg2l.apps.googleusercontent.com";

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<AuthNavigationType>>();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId,
    iosClientId,
    webClientId: googleClientId,
    redirectUri: makeRedirectUri({ useProxy: false }),
    scopes: ['profile', 'email'], // Request these scopes
  });
  console.log(makeRedirectUri({ useProxy: false }));

  useEffect(() => {
    if (response) {
      console.log('Response:', response);
    }
  }, [response]);

  const handleToken = () => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const token = authentication?.accessToken;
      console.log('access token', token);
    }
  };

  useEffect(() => {
    handleToken();
  }, [response]);

  const { navigate: navigateAuth }: NavigationProp<AuthNavigationType> =
    useNavigation();

  const { navigate: navigateReset }: NavigationProp<AuthNavigationType> =
    useNavigation();

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for validating email

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      Alert.alert('Success', response.data.message);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className=" flex-1">
      {isLoading && (
        <View className=" absolute z-50 h-full w-full justify-center items-center">
          <View className=" h-full w-full justify-center items-center bg-black opacity-[0.45]"></View>

          <View className=" absolute">
            <ActivityIndicator size="large" color="white" />
          </View>
        </View>
      )}

      <View className=" justify-center items-center relative flex-1">
        <View
          className=" justify-center w-full px-4"
          style={{
            height: height * 0.75,
          }}
        >
          <Animated.View
            className=" justify-center items-center"
            entering={FadeInDown.duration(100).springify()}
          >
            <Text
              className=" text-neutral-800 text-2xl leading-[60px]"
              style={{
                fontFamily: 'PlusJakartaSansBold',
              }}
            >
              Welcome Back, User
            </Text>

            <Text className=" text-neutral-500 text-sm font-medium">
              Please enter your details.
            </Text>
          </Animated.View>

          <Animated.View
            className=" py-8 space-y-8"
            entering={FadeInDown.duration(100).delay(200).springify()}
          >
            <View className=" border-2 border-gray-400 rounded-lg">
              <TextInput
                className=" p-4 "
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="Email"
                autoCapitalize="none"
              />
            </View>

            <View>
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
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="gray"
                  />
                </Pressable>
              </View>
              <View className="flex-row justify-between mt-2">
                <View />
                <Pressable onPress={() => navigateAuth('Code')}>
                  <Text className="text-blue-600 font-medium">
                    Forgot Password?
                  </Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            className=" w-full justify-start"
            entering={FadeInDown.duration(100).delay(300).springify()}
          >
            <View className="pb-6">
              <Button title={'Login'} action={handleLogin} />
            </View>
          </Animated.View>

          {/* <View>
            <Breaker />
          </View>

          <View className=" w-full justify-normal">
            <Animated.View
              entering={FadeInDown.duration(100).delay(600).springify()}
              className="  pb-4"
            >
              <ButtonOutlines
                title="Continue with Google"
                action={() => {
                  promptAsync();
                }}
              >
                <AntDesign name="google" size={20} color="gray" />
              </ButtonOutlines>
            </Animated.View>
          </View> */}

          <Animated.View
            className=" flex-row justify-center items-center"
            entering={FadeInDown.duration(100).delay(700).springify()}
          >
            <Text
              className=" text-neutral-500 text-lg font-medium leading-[38px] text-center"
              style={{
                fontFamily: 'PlusJakartaSansMedium',
              }}
            >
              Don't have an account?
            </Text>
            <Pressable onPress={() => navigateAuth('Register')}>
              <Text
                className=" px-1 text-neutral-800 text-lg font-medium leading-[38px] text-center "
                style={{
                  fontFamily: 'PlusJakartaSansMedium',
                }}
              >
                Register
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
