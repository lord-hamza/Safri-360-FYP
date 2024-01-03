import { StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeScreen from "../screens/HomeScreen";
import ManageHistoryScreen from "../screens/DrawerScreens/History/ManageHistoryScreen";
import SettingsScreen from "../screens/DrawerScreens/Settings/SettingsScreen";
import SafetyScreen from "../screens/DrawerScreens/SafetyScreen";
import CustomDrawer from "./CustomDrawer";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: "#A7E92F",
                drawerActiveTintColor: "#000",
                drawerLabelStyle: {
                    fontSize: 16,
                    fontFamily: "SatoshiBold",
                    fontWeight: "600",
                    marginLeft: -10,
                },
            }}
        >
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={22} color={color} style={styles.icon} />
                    ),
                }}
            />
            <Drawer.Screen
                name="History"
                component={ManageHistoryScreen}
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="analytics-outline" size={22} color={color} style={styles.icon} />
                    ),
                    headerShown: true,
                    headerTitle: "Past Trips",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontSize: 21,
                        fontFamily: "SatoshiBlack",
                        fontWeight: "400",
                    },
                    headerStyle: {
                        height: 70,
                    },
                    headerBackTitleVisible: false,
                }}
            />
            <Drawer.Screen
                name="Safety"
                component={SafetyScreen}
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="shield-checkmark-outline" size={22} color={color} style={styles.icon} />
                    ),
                    headerShown: true,
                    headerTitle: "Safety",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontSize: 21,
                        fontFamily: "SatoshiBlack",
                        fontWeight: "400",
                    },
                    headerStyle: {
                        height: 70,
                    },
                    headerBackTitleVisible: false,
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="settings-outline" size={22} color={color} style={styles.icon} />
                    ),
                    headerShown: true,
                    headerTitle: "Settings",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontSize: 21,
                        fontFamily: "SatoshiBlack",
                        fontWeight: "400",
                    },
                    headerStyle: {
                        height: 70,
                    },
                    headerBackTitleVisible: false,
                }}
            />
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    icon: {
        marginLeft: 10,
    },
});

export default DrawerNavigation;
