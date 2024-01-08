import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { ref, push, set, onValue } from "firebase/database";
import { Skeleton } from "@rneui/themed";
import moment from "moment";

import { selectUser } from "@store/slices/userSlice";
import {
    selectOrigin,
    selectDestination,
    setOrigin,
    setDestination,
    selectTravelRouteInformation,
} from "@store/slices/navigationSlice";
import { selectRide, setRide } from "@store/slices/rideSlice";
import { dbRealtime } from "../../firebase/config";
import { useMapContext } from "@contexts/MapContext";
import { moveCameraToCenter } from "@utils/moveCameraToCenter";
import PlacesAutocomplete from "@components/PlacesAutocomplete";
import CarPicker from "@components/Ride/CarPicker";
import FareCalculator from "@components/Ride/FareCalculator";
import PrimaryButton from "@components/Buttons/PrimaryButton";

const RideInfoCard = ({ navigation }) => {
    const { mapRef, setShowDirection, keyboardOpen } = useMapContext();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const travelRouteInformation = useSelector(selectTravelRouteInformation);
    const ride = useSelector(selectRide);

    const EDGE_PADDING_VALUE = 70;

    const edgePadding = {
        top: EDGE_PADDING_VALUE,
        right: EDGE_PADDING_VALUE,
        bottom: EDGE_PADDING_VALUE,
        left: EDGE_PADDING_VALUE,
    };

    useEffect(() => {
        if (ride && ride.status === "assigned") {
            navigation.navigate("RideRequestCard");
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            traceRoute();
        }, 500);
    }, [origin, destination]);

    const onPlaceSelected = (details, data, flag) => {
        const reduxAction = flag === "origin" ? setOrigin : setDestination;
        const location = {
            locationName: data.structured_formatting?.main_text || "",
            latitude: details.geometry?.location.lat || 0,
            longitude: details.geometry?.location.lng || 0,
        };
        dispatch(reduxAction(location));
        moveCameraToCenter(mapRef, location);
    };

    const traceRoute = () => {
        if (origin && destination) {
            setShowDirection(true);
            mapRef.current?.fitToCoordinates([origin, destination], { edgePadding: edgePadding, animated: true });
        }
    };

    const fetchRide = () => {
        const rideRef = ref(dbRealtime, "Rides/");
        const rideKeyRef = push(rideRef);
        set(rideKeyRef, {
            rideID: rideKeyRef.key,
            customerID: user.uid,
            selectedCar: ride?.car,
            origin: origin,
            destination: destination,
            distance: travelRouteInformation?.distance,
            duration: travelRouteInformation?.duration,
            fare: ride?.fare,
            status: "fetching",
            createdAt: moment(Date.now()).format("LLLL"),
        })
            .then(() => {
                dispatch(
                    setRide({
                        ...ride,
                        id: rideKeyRef.key,
                        origin: origin,
                        destination: destination,
                        distance: travelRouteInformation?.distance,
                        duration: travelRouteInformation?.duration,
                        status: "fetching",
                        createdAt: moment(Date.now()).format("LLLL"),
                    }),
                );
                onValue(rideRef, (snapshot) => {
                    const rideData = snapshot.val();
                    for (const rideKey in rideData) {
                        const Ride = rideData[rideKey];
                        if (Ride.customerID === user.uid && Ride.status === "assigned") {
                            navigation.navigate("RideRequestCard");
                        }
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <BottomSheetView style={styles.container}>
            {ride.status === "fetching" ? (
                <View style={styles.loadingContainer}>
                    <Skeleton animation="pulse" width="100%" height="50" skeletonStyle={styles.skeletonStyle} />
                </View>
            ) : (
                <View style={[styles.InputsContainer, !keyboardOpen && { justifyContent: "space-between" }]}>
                    <PlacesAutocomplete
                        placeholder={"Pickup"}
                        onPlaceSelected={(details, data) => {
                            onPlaceSelected(details, data, "origin");
                        }}
                        currentLocation={true}
                        currentLocationLabel={"Current Location"}
                    />
                    <PlacesAutocomplete
                        placeholder={"Destination"}
                        onPlaceSelected={(details, data) => {
                            onPlaceSelected(details, data, "destination");
                        }}
                    />
                    <CarPicker />
                    <FareCalculator />
                    <PrimaryButton
                        text="Request a Ride"
                        action={() => fetchRide()}
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonText}
                        disabled={!origin || !destination}
                    />
                </View>
            )}
        </BottomSheetView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        paddingHorizontal: 10,
        backgroundColor: "white",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    skeletonStyle: {
        height: 150,
    },
    InputsContainer: {
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 5,
        width: "100%",
    },
    button: {
        backgroundColor: "#A7E92F",
        padding: 10,
        borderRadius: 7,
    },
    buttonText: {
        color: "#000",
        textAlign: "center",
        fontSize: 17,
        fontWeight: "500",
        fontFamily: "SatoshiBold",
    },
});

export default RideInfoCard;
