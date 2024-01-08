import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import RideInfoCard from "@screens/Ride/RideInfoCard";
import RideRequestCard from "@screens/Ride/RideRequestCard";
import ToursInfoCard from "@screens/Tours/ToursInfoCard";
import TourBookedScreen from "@screens/Tours/TourBookedScreen";
import FreightInfoCard from "@screens/Freight/FreightInfoCard";
import FreightRequestCard from "@screens/Freight/FreightRequestCard";

const Stack = createNativeStackNavigator();

const BottomSheetNavigator = ({ selectedMode }) => {
    let screens;

    switch (selectedMode) {
        case "Ride":
            screens = (
                <>
                    <Stack.Screen name="RideInfoCard" component={RideInfoCard} />
                    <Stack.Screen name="RideRequestCard" component={RideRequestCard} />
                </>
            );
            break;
        case "Tours":
            screens = (
                <>
                    <Stack.Screen name="ToursInfoCard" component={ToursInfoCard} />
                    <Stack.Screen name="TourBookedScreen" component={TourBookedScreen} />
                </>
            );
            break;
        case "Freight":
            screens = (
                <>
                    <Stack.Screen name="FreightInfoCard" component={FreightInfoCard} />
                    <Stack.Screen name="FreightRequestCard" component={FreightRequestCard} />
                </>
            );
            break;
        default:
            screens = <></>;
    }

    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator screenOptions={{ headerShown: false, animation: "none" }}>{screens}</Stack.Navigator>
        </NavigationContainer>
    );
};

export default BottomSheetNavigator;
