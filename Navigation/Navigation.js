import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

//screens
import HomeScreen from "../screens/HomeScreen";
import RadioScreen from "../screens/RadioScreen";
import NotificationScreen from "../screens/NotificationScreen";
import DevotionScreen from "../screens/DevotionScreen";
import UserScreen from "../screens/UserScreen";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Radio" component={RadioScreen} />
      <Tab.Screen name="Devotion" component={DevotionScreen} />
      <Tab.Screen name="Notificaciones" component={NotificationScreen} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
