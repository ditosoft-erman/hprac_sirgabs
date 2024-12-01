import { View, Text } from "react-native";
import React, { useState } from "react";
import styled from "styled-components";
import { StatusBar } from "expo-status-bar";
import RootNavigation from "./src/navigation/RootNavigation";
import useCacheResources from "./hooks/useCacheResources";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  const isLoadingComplete = useCacheResources();
  const queryClient = new QueryClient();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <Container>
      <StatusBar style="auto" />
      <QueryClientProvider client={queryClient}>
        <RootNavigation />
      </QueryClientProvider>
    </Container>
  );
};

export default App;

const Container = styled(View)`
  flex: 1;
`;
