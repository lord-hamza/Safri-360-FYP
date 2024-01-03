import "expo-dev-client";
import { useEffect, useState, createRef } from "react";
import { ActivityIndicator, StatusBar } from "react-native";
import { useReduxDevToolsExtension } from "@react-navigation/devtools";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FlashMessage from "react-native-flash-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./store/index";
import { auth } from "./firebase/config";
import { FirebaseProvider } from "./contexts/FirebaseContext";
import { MapProvider } from "./contexts/MapContext";
import FontLoader from "./components/FontLoader";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import PasswordResetScreen from "./screens/PasswordResetScreen";
import PhoneRegisterScreen from "./screens/PhoneRegisterScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import EditProfileScreen from "./screens/DrawerScreens/Settings/EditProfileScreen";
import ChangePasswordScreen from "./screens/DrawerScreens/Settings/ChangePasswordScreen";
import ChangePhoneNumberScreen from "./screens/DrawerScreens/Settings/ChangePhoneNumberScreen";
import RidesHistoryScreen from "./screens/DrawerScreens/History/Rides/RidesHistoryScreen";
import RideHistoryDetailScreen from "./screens/DrawerScreens/History/Rides/RideHistoryDetailScreen";
import ToursHistoryScreen from "./screens/DrawerScreens/History/Tours/ToursHistoryScreen";
import TourHistoryDetailScreen from "./screens/DrawerScreens/History/Tours/TourHistoryDetailScreen";
import DrawerNavigation from "./navigation/DrawerNavigation";

const Stack = createStackNavigator();
navigator.geolocation = require("react-native-geolocation-service");

const App = () => {
    const [loading, setLoading] = useState(true);
    const navigationRef = createRef();

    useReduxDevToolsExtension(navigationRef);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setLoading(false);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <ActivityIndicator
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                size="large"
                color="#000"
            />
        );
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <FirebaseProvider>
                        <MapProvider>
                            <FontLoader>
                                <NavigationContainer ref={() => navigationRef}>
                                    <SafeAreaProvider>
                                        <StatusBar barStyle="default" animated={true} />
                                        <FlashMessage position="top" />
                                        <Stack.Navigator
                                            initialRouteName={auth.currentUser === null ? "Login" : "Home"}
                                            screenOptions={{ headerShown: false, animationEnabled: false }}
                                        >
                                            <Stack.Screen name="HomeScreen" component={DrawerNavigation} />
                                            <Stack.Screen name="Login" component={LoginScreen} />
                                            <Stack.Screen name="SignUp" component={SignUpScreen} />
                                            <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
                                            <Stack.Screen name="PhoneRegisterScreen" component={PhoneRegisterScreen} />
                                            <Stack.Screen name="OTPVerificationScreen" component={OTPVerificationScreen} />
                                            <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
                                            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
                                            <Stack.Screen name="ChangePhoneNumberScreen" component={ChangePhoneNumberScreen} />
                                            <Stack.Screen name="RidesHistoryScreen" component={RidesHistoryScreen} />
                                            <Stack.Screen name="ToursHistoryScreen" component={ToursHistoryScreen} />
                                            <Stack.Screen name="RideHistoryDetailScreen" component={RideHistoryDetailScreen} />
                                            <Stack.Screen name="TourHistoryDetailScreen" component={TourHistoryDetailScreen} />
                                        </Stack.Navigator>
                                    </SafeAreaProvider>
                                </NavigationContainer>
                            </FontLoader>
                        </MapProvider>
                    </FirebaseProvider>
                </GestureHandlerRootView>
            </PersistGate>
        </Provider>
    );
};

export default App;
