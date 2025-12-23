import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { LogBox } from 'react-native';
import { AuthProvider } from '@/contexts/authContext';

LogBox.ignoreLogs([
  'Text strings must be rendered within a <Text> component',
]);

const StackLayout = () => {
    return <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name = "(main)/profileModal" options={{presentation: "modal", animation: "slide_from_bottom",}}  />
      <Stack.Screen name = "(main)/newConversationModal" options={{presentation: "modal", animation: "slide_from_bottom",}}  />
    </Stack>
}

const RootLayout = () => {
    return (
      <AuthProvider>
        <StackLayout />
      </AuthProvider>
    )
}


export default RootLayout;
// export default StackLayout;

const styles = StyleSheet.create({})