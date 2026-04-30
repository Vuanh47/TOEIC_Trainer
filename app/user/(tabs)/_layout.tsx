import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius } from "@/src/assets/styles/theme";

type TabIconProps = {
  focused: boolean;
  label: string;
  icon: ReactNode;
  elevated?: boolean;
};

function TabIcon({ focused, label, icon, elevated = false }: TabIconProps) {
  return (
    <View style={[styles.tabItem, elevated ? styles.tabItemElevated : null]}>
      <View
        style={[
          styles.iconWrap,
          focused ? styles.iconWrapActive : null,
          elevated ? styles.iconWrapElevated : null,
          focused && elevated ? styles.iconWrapElevatedActive : null,
        ]}
      >
        {icon}
      </View>
      <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : null]}>
        {label}
      </Text>
    </View>
  );
}

export default function UserTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Ionicons
                  color={focused ? colors.surface : colors.textMuted}
                  name="home-outline"
                  size={21}
                />
              }
              label="HOME"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Ionicons
                  color={focused ? colors.surface : colors.textMuted}
                  name="sparkles-outline"
                  size={21}
                />
              }
              label="PRACTICE"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              elevated
              focused={focused}
              icon={
                <MaterialCommunityIcons
                  color={colors.surface}
                  name="cards-outline"
                  size={26}
                />
              }
              label="CARDS"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Ionicons
                  color={focused ? colors.surface : colors.textMuted}
                  name="document-text-outline"
                  size={20}
                />
              }
              label="TEST"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <FontAwesome5
                  color={focused ? colors.surface : colors.textMuted}
                  name="user-circle"
                  size={19}
                />
              }
              label="PROFILE"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  iconWrapActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  iconWrapElevated: {
    backgroundColor: colors.primary,
    borderColor: "rgba(255,255,255,0.9)",
    borderWidth: 4,
    height: 76,
    marginTop: -28,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    width: 76,
  },
  iconWrapElevatedActive: {
    transform: [{ scale: 1.02 }],
  },
  tabBar: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 0,
    elevation: 0,
    height: 94,
    paddingBottom: 18,
    paddingTop: 10,
    position: "absolute",
  },
  tabItem: {
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-end",
    marginTop: 10,
    minWidth: 68,
  },
  tabItemElevated: {
    marginTop: 0,
  },
  tabLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  tabLabelActive: {
    color: colors.primaryDark,
  },
});
