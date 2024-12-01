import { View, Text } from "react-native";
import React, { useState } from "react";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./AuthNavigation";
import HomeScreen from "../screens/home/HomeScreen";

const Stack = createStackNavigator();

const RootNavigation = () => {
  const [session, setSession] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
          animation: "default",
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        {session ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
