import { View, Text } from "react-native";
import React from "react";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import UsersSceen from "../screens/user/UsersSceen";
const Stack = createStackNavigator();

const UsersNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        animation: "default",
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen name="Users" component={UsersSceen} />
    </Stack.Navigator>
  );
};

export default UsersNavigation;
