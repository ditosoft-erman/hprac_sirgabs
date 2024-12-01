import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import Animated, { FadeInRight } from "react-native-reanimated";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const SplashScreen = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { navigate }: NavigationProp<SplashNavigationType> = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigate("Welcome");
    }, 2000);
  }, []);

  return (
    <SafeAreaView className=" flex-1 justify-center items-center">
      <StatusBar style="auto" />
      <View className=" w-full px-4 items-center">
        <Animated.View
          className="flex-row justify-center items-center"
          entering={FadeInRight.duration(100).springify(0)}
        >
          <View className="pr-2">
            <View className=" w-20 h-20 overflow-hidden">
              <Image
                source={require("../../../assets/images/logo.png")}
                placeholder={blurhash}
                contentFit="cover"
                transition={1000}
                className="w-full h-full flex-1"
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View
          className=" flex-row justify-center items-center"
          entering={FadeInRight.duration(100).delay(200).springify(0)}
        >
          <Text
            className=" text-neutral-600 text-xl leading-[60px] pl-1"
            style={{
              fontFamily: "PlusJakartaSans",
            }}
          >
            AUTHENTICATION
          </Text>
          <Text
            className=" text-[#31aca3] text-xl leading-[60px] pl-1"
            style={{
              fontFamily: "PlusJakartaBoldItalic",
            }}
          >
            APP
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
