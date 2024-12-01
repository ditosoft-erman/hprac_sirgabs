import * as fonts from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import * as SplasScreen from "expo-splash-screen";
export default function useCacheResources() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplasScreen.preventAutoHideAsync();
        await fonts.loadAsync({
          PlusJakartaSans: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
          PlusJakartaSansExtraBold: require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
          PlusJakartaSansBold: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
          PlusJakartaBoldItalic: require("../assets/fonts/PlusJakartaSans-BoldItalic.ttf"),
          PlusJakartaMedium: require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
          PlusJakartaSansMediumItalic: require("../assets/fonts/PlusJakartaSans-MediumItalic.ttf"),
          ...FontAwesome.font,
        });
      } catch (e) {
        alert(e);
      } finally {
        setIsLoadingComplete(true);
        SplasScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
