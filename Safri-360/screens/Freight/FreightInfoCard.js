import { useState, useEffect } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useSelector, useDispatch } from "react-redux";
import { ref, update, push, onValue } from "firebase/database";
import moment from "moment";

import { dbRealtime } from "../../firebase/config";
import { showError } from "@utils/ErrorHandlers";
import { useMapContext } from "@contexts/MapContext";
import { selectUser } from "@store/slices/userSlice";
import { selectOrigin, setOrigin, selectDestination, setDestination } from "@store/slices/navigationSlice";
import { selectFreight, setFreight } from "@store/slices/freightSlice";
import { moveCameraToCenter } from "@utils/moveCameraToCenter";
import PlacesAutocomplete from "@components/PlacesAutocomplete";
import VehiclePicker from "@components/Freight/VehiclePicker";
import PrimaryButton from "@components/Buttons/PrimaryButton";
import FreightFareCalculator from "@components/Freight/FreightFareCalculator";

const FreightInfoCard = ({ navigation }) => {
    const [weight, setWeight] = useState("");
    const { mapRef, setShowDirection } = useMapContext();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const freight = useSelector(selectFreight);

    const EDGE_PADDING_VALUE = 70;

    const edgePadding = {
        top: EDGE_PADDING_VALUE,
        right: EDGE_PADDING_VALUE,
        bottom: EDGE_PADDING_VALUE,
        left: EDGE_PADDING_VALUE,
    };

    useEffect(() => {
        setTimeout(() => {
            traceRoute();
        }, 500);
    }, [origin, destination]);

    useEffect(() => {
        const selectedVehicle = determineVehicleBasedOnWeight(parseInt(weight));
        dispatch(setFreight({ vehicle: selectedVehicle }));
    }, [weight]);

    const traceRoute = () => {
        if (origin && destination) {
            setShowDirection(true);
            mapRef.current?.fitToCoordinates([origin, destination], { edgePadding: edgePadding, animated: true });
        }
    };

    const determineVehicleBasedOnWeight = (weight) => {
        if (weight > 0 && weight <= 350) {
            return "loaderRickshaw";
        } else if (weight > 350 && weight <= 5000) {
            return "pickupVan";
        } else if (weight > 5000 && weight <= 50000) {
            return "truck";
        }
        return null;
    };

    const validateWeight = (weightText) => {
        const validWeightRegex = /^[1-9]\d*$/; // Positive integer greater than 0
        const isNumeric = /^[0-9]*$/; // Check if input is numeric

        if (!isNumeric.test(weightText)) {
            showError("Invalid Input Type!", "Please enter a valid numeric weight.");
            setWeight("");
        } else if (!validWeightRegex.test(weightText)) {
            showError("Invalid Input Format!", "Weight must be greater than 0.");
            setWeight("");
        } else if (parseInt(weightText) > 50000) {
            showError("Invalid Input Format!", "Maximum weight limit is 50,000 kg");
            setWeight("");
        } else {
            setWeight(weightText);
        }
    };

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

    const fetchFreight = () => {
        const freightRef = ref(dbRealtime, "FreightRequests/");
        const freightKeyRef = push(freightRef);
        update(freightKeyRef, {
            id: freightKeyRef.key,
            origin: origin,
            destination: destination,
            customerID: user.uid,
            vehicle: freight.vehicle,
            weight: weight,
            fare: freight.fare,
            status: "fetching",
            createdAt: moment(Date.now()).format("LLLL"),
        })
            .then(() => {
                dispatch(
                    setFreight({
                        id: freightKeyRef.key,
                        origin: origin,
                        destination: destination,
                        customerID: user.uid,
                        weight: weight,
                        status: "fetching",
                        createdAt: moment(Date.now()).format("LLLL"),
                    }),
                );
                onValue(freightRef, (snapshot) => {
                    const freightData = snapshot.val();
                    for (const freightKey in freightData) {
                        const freight = freightData[freightKey];
                        if (freight.customerID === user.uid) {
                            if (freight.status === "fetching") {
                                navigation.navigate("FreightRequestCard");
                            }
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
            <View style={styles.inputsContainer}>
                <PlacesAutocomplete
                    placeholder={"Pickup Location"}
                    onPlaceSelected={(details, data) => {
                        onPlaceSelected(details, data, "origin");
                    }}
                    currentLocation={true}
                    currentLocationLabel={"Current Location"}
                />
                <PlacesAutocomplete
                    placeholder={"Destination Location"}
                    onPlaceSelected={(details, data) => {
                        onPlaceSelected(details, data, "destination");
                    }}
                />
                <VehiclePicker selectedVehicle={freight.vehicle} />
                <View style={styles.weightInputContainer}>
                    <TextInput
                        placeholder="Weight (kg)"
                        style={[styles.textInput, { marginRight: 5 }]}
                        value={weight.toString()}
                        onChangeText={(text) => {
                            validateWeight(text);
                        }}
                        keyboardType="number-pad"
                        maxLength={5}
                    />
                    <FreightFareCalculator weight={weight} />
                </View>
                <PrimaryButton
                    text="Request a Freight"
                    action={fetchFreight}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    disabled={!((origin || destination) && weight && weight > 0)}
                />
            </View>
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
    inputsContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        paddingHorizontal: 5,
        width: "100%",
    },
    weightInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    textInput: {
        flex: 1,
        height: 50,
        marginTop: 5,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        color: "#000",
        fontSize: 16,
        fontWeight: "500",
        backgroundColor: "#f2f2f2",
        fontFamily: "SatoshiMedium",
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

export default FreightInfoCard;
