import { GOOGLE_MAPS_API_KEY } from "@env";
import { useState, useEffect, useRef, useMemo } from "react";
import {
    StyleSheet,
    View,
    Text,
    Alert,
    Keyboard,
    Platform,
    Dimensions,
    BackHandler,
    PermissionsAndroid,
    TouchableWithoutFeedback,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import BottomSheet, { useBottomSheetSpringConfigs } from "@gorhom/bottom-sheet";
import { useSelector, useDispatch } from "react-redux";
import { ref, remove } from "firebase/database";

import { dbRealtime } from "../firebase/config";
import { setCurrentUserLocation, selectCurrentUserLocation } from "../store/slices/locationSlice";
import {
    setOrigin,
    selectOrigin,
    setDestination,
    selectDestination,
    setTravelRouteInformation,
    selectTravelRouteInformation,
} from "../store/slices/navigationSlice";
import { selectRide, resetRide } from "../store/slices/rideSlice";
import { selectTour, resetTour } from "../store/slices/tourSlice";
import { resetFreight } from "../store/slices/freightSlice";
import { useMapContext } from "../contexts/MapContext";
import { moveCameraToCenter } from "../utils/moveCameraToCenter";
import { extractCoordinates } from "../utils/extractCoordinates";
import { appModes } from "../constants/AppModes";
import Map from "../components/Map";
import BottomSheetNavigator from "../navigation/BottomSheetNavigator";
import AppModeButton from "../components/Buttons/AppModeButton";
import DrawerMenuButton from "../components/Buttons/DrawerMenuButton";
import TimeCard from "../components/Tours/TimeCard";

const HomeScreen = ({ navigation }) => {
    const [selectedMode, setSelectedMode] = useState("Ride");
    const [initialPosition, setInitialPosition] = useState(null);

    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const currentUserLocation = useSelector(selectCurrentUserLocation);
    const travelRouteInformation = useSelector(selectTravelRouteInformation);
    const ride = useSelector(selectRide);
    const tour = useSelector(selectTour);

    const { width, height } = Dimensions.get("window");
    const { mapRef, keyboardOpen, setKeyboardOpen, showDirection, setShowDirection } = useMapContext();
    const BottomSheetRef = useRef();
    const dispatch = useDispatch();

    const snapPoints = useMemo(() => {
        return [
            keyboardOpen
                ? "85%"
                : tour.isBooked
                ? "50%"
                : ride.status === "fetching" || ride.status === "completed"
                ? "30%"
                : "57%",
        ];
    }, [keyboardOpen, tour.isBooked, ride.status]);

    const animationConfigs = useBottomSheetSpringConfigs({
        damping: 80,
        overshootClamping: true,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
        stiffness: 500,
    });

    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.03;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted === "granted") {
                console.log("You can use Geolocation");
                return true;
            } else {
                console.log("You cannot use Geolocation");
                return false;
            }
        } catch (error) {
            console.error("Error getting current location: ", error);
            return false;
        }
    };

    const getOriginName = async (latitude, longitude) => {
        const apiKey = GOOGLE_MAPS_API_KEY;
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const address = data?.results[0].formatted_address;
                return address;
            } else {
                throw new Error("Unable to get location name");
            }
        } catch (error) {
            console.error("Error fetching location name:", error.message);
            throw error;
        }
    };

    const getLocation = () => {
        Geolocation.getCurrentPosition(
            async (position) => {
                dispatch(setCurrentUserLocation(extractCoordinates(position)));
                const originName = await getOriginName(position?.coords.latitude, position?.coords.longitude);
                setInitialPosition({
                    ...extractCoordinates(position),
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                });
                dispatch(setOrigin({ ...extractCoordinates(position), locationName: originName }));
                moveCameraToCenter(mapRef, position.coords);
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    };

    useEffect(() => {
        dispatch(setOrigin(null));
        dispatch(setDestination(null));
        dispatch(setTravelRouteInformation(null));
        if (!(destination && travelRouteInformation) && currentUserLocation) {
            moveCameraToCenter(mapRef, currentUserLocation);
        }

        (async () => {
            const hasPermission = await requestLocationPermission();
            if (hasPermission) {
                getLocation();
            }
        })();

        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardOpen(true);
        });
        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardOpen(false);
        });
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel",
                },
                { text: "YES", onPress: () => BackHandler.exitApp() },
            ]);
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
            backHandler.remove();
        };
    }, []);

    useEffect(() => {
        if (!(destination || origin) && currentUserLocation) {
            moveCameraToCenter(mapRef, currentUserLocation);
        }
    }, [keyboardOpen]);

    const resetState = () => {
        setShowDirection(false);
        dispatch(setOrigin(null));
        dispatch(setDestination(null));
        dispatch(setTravelRouteInformation(null));
        getLocation();
    };

    useEffect(() => {
        switch (selectedMode) {
            case "Ride":
                dispatch(resetTour());
                dispatch(resetFreight());
                resetState();
                break;
            case "Tours":
                dispatch(resetRide());
                dispatch(resetFreight());
                resetState();
                break;
            case "Freight":
                dispatch(resetRide());
                dispatch(resetTour());
                resetState();
                break;
            default:
                break;
        }
    }, [selectedMode]);

    const handleTourBackPress = () => {
        dispatch(resetTour());
    };

    const handleRideBackPress = () => {
        const rideRef = ref(dbRealtime, "Rides/" + ride.id);
        remove(rideRef)
            .then(() => {
                setShowDirection(false);
                dispatch(resetRide());
                dispatch(setOrigin(null));
                dispatch(setDestination(null));
                dispatch(setTravelRouteInformation(null));
                getLocation();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.mainContainer}>
                {tour && tour.isBooked ? (
                    <>
                        <DrawerMenuButton icon="arrow-back-outline" action={handleTourBackPress} />
                        <TimeCard />
                    </>
                ) : ride.status === "fetching" || showDirection ? (
                    <DrawerMenuButton icon="arrow-back-outline" action={handleRideBackPress} />
                ) : (
                    <DrawerMenuButton icon="menu" action={() => navigation.openDrawer()} />
                )}
                <View style={ride.status === "fetching" ? { height: "85%" } : { height: "55%" }}>
                    <Map initialPosition={initialPosition} />
                </View>
                <BottomSheet
                    ref={BottomSheetRef}
                    snapPoints={snapPoints}
                    keyboardBehavior={Platform.OS === "ios" ? "extend" : "interactive"}
                    keyboardBlurBehavior="restore"
                    android_keyboardInputMode="adjustResize"
                    animationConfigs={animationConfigs}
                    style={styles.bottomSheetContainer}
                >
                    {tour.isBooked ? (
                        <View style={styles.modeButtons}>
                            <Text style={styles.bookedText}>Your Tour has been Booked!</Text>
                        </View>
                    ) : ride.status === "fetching" ? (
                        <></>
                    ) : ride.status === "assigned" && showDirection ? (
                        <View style={styles.modeButtons}>
                            <Text style={styles.rideBookingText}>Your Ride has been Booked!</Text>
                        </View>
                    ) : ride.status === "ongoing" && showDirection ? (
                        <View style={styles.modeButtons}>
                            <Text style={styles.rideBookingText}>Your Ride is Ongoing!</Text>
                        </View>
                    ) : ride.status === "completed" ? (
                        <View style={styles.modeButtons}>
                            <Text style={styles.rideBookingText}>You have reached your destination!</Text>
                        </View>
                    ) : (
                        <View style={styles.modeButtons}>
                            {appModes.map((appMode, index) => (
                                <AppModeButton
                                    key={index}
                                    icon={appMode.icon}
                                    mode={appMode.mode}
                                    action={() => {
                                        setSelectedMode(appMode.mode);
                                    }}
                                    selectedMode={selectedMode === appMode.mode}
                                />
                            ))}
                        </View>
                    )}
                    <BottomSheetNavigator selectedMode={selectedMode} />
                </BottomSheet>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    bottomSheetContainer: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    modeButtons: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10,
    },
    bookedText: {
        fontSize: 18,
        fontFamily: "SatoshiBlack",
        fontWeight: "500",
        textAlign: "center",
        marginVertical: 24,
    },
    rideBookingText: {
        fontSize: 17,
        fontFamily: "SatoshiBlack",
        fontWeight: "500",
        textAlign: "center",
        marginVertical: 22,
    },
});

export default HomeScreen;
