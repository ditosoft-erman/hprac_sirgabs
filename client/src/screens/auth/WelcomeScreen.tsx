import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import Button from "@/src/components/Button";
import ButtonOutlines from "@/src/components/ButtonOutlines";
import Breaker from "../../components/Breaker";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const WelcomeScreen = () => {
  const { navigate: navigateAuth }: NavigationProp<AuthNavigationType> =
    useNavigation();

  return (
    <SafeAreaView className=" flex-1 justify-center items-center bg-white">
      <StatusBar style="auto" />
      <View className=" w-full px-4 items-center justify-center space-y-6 h-full">
        <View className=" w-full px-4 items-center">
          <Animated.View
            entering={FadeInRight.duration(100).springify()}
            className=" flex-row justify-center items-center"
          >
            <View>
              <View className=" w-20 h-20 overflow-hidden">
                <Image
                  source={require("../../../assets/images/logo.png")}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={1000}
                  className=" w-full h-full flex-1 "
                />
              </View>
            </View>
          </Animated.View>
        </View>

        <View className=" justify-center items-center">
          <Animated.Text
            entering={FadeInDown.duration(100).delay(300).springify()}
            className=" text-neutral-800 text-3xl font-medium leading-[60x]"
            style={{
              fontFamily: "PlusJakartaSansBold",
            }}
          >
            Welcome
          </Animated.Text>
        </View>

        <View className=" w-full justify-start">
          <Animated.View
            entering={FadeInDown.duration(100).delay(300).springify()}
            className="pb-6"
          >
            <Button title="Login" action={() => navigateAuth("Login")} />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(100).delay(400).springify()}
          >
            <ButtonOutlines
              title="Sign Up"
              action={() => navigateAuth("Register")}
            />
          </Animated.View>
        </View>

        {/* <View>
          <Breaker />
        </View> */}

        {/* <View className=" w-full justify-normal">
          <Animated.View
            entering={FadeInDown.duration(100).delay(600).springify()}
            className=" border border-white pb-4"
          >
            <ButtonOutlines title="Continue with Google">
              <AntDesign name="google" size={20} color="gray" />
            </ButtonOutlines>
          </Animated.View>
        </View> */}
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
