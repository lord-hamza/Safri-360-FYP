import { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, ActivityIndicator } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useSelector, useDispatch } from "react-redux";
import { ref, get, update } from "firebase/database";
import moment from "moment";

import { useMapContext } from "../../contexts/MapContext";
import { dbRealtime } from "../../firebase/config";
import { selectUser } from "../../store/slices/userSlice";
import { setOrigin, setDestination } from "../../store/slices/navigationSlice";
import { moveCameraToCenter } from "../../utils/moveCameraToCenter";
import { selectTour, setTour } from "../../store/slices/tourSlice";
import PlacesAutocomplete from "../../components/PlacesAutocomplete";
import DestinationPicker from "../../components/Tours/DestinationPicker";
import FareDisplay from "../../components/Tours/FareDisplay";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { showError } from "../../utils/ErrorHandlers";

const ToursInfoCard = ({ navigation }) => {
    const [numberOfPeople, setNumberOfPeople] = useState("");
    const [loading, setLoading] = useState(false);
    const user = useSelector(selectUser);
    const tour = useSelector(selectTour);
    const dispatch = useDispatch();
    const { mapRef } = useMapContext();

    useEffect(() => {
        navigation.addListener("focus", () => {
            setNumberOfPeople("");
        });
        return () => {
            navigation.removeListener("focus");
        };
    }, []);

    const generateRandomID = () => {
        let id = tour.companyName.charAt(0).toUpperCase() + "-";
        const length = 4;
        for (let i = 0; i < length; i++) {
            id += Math.floor(Math.random() * 10);
        }
        return id;
    };

    const checkTourAvailability = async (toursRef, tourId) => {
        const snapshot = await get(toursRef);
        const toursData = snapshot.val();
        const toursKey = Object.keys(toursData);
        const tours = Object.values(toursData);
        let tourSeatsLeft;
        let tourTotalFare;
        let tourFare;
        let tourFound = false;
        tours.forEach((tour) => {
            const providerTours = tour.Tours;
            const toursList = Object.values(providerTours);
            toursList.forEach((tour) => {
                if (tour.tourID === tourId) {
                    tourSeatsLeft = tour.tourSeatsLeft;
                    tourTotalFare = tour.tourTotalFare;
                    tourFare = tour.tourFare;
                    tourFound = true;
                }
            });
        });
        return { tourFound, tourSeatsLeft, tourTotalFare, toursKey, tourFare };
    };

    const updateTourSeatsAndFare = async (toursKey, tourId, tourSeatsLeft, tourTotalFare, fare, numberOfPeople) => {
        await update(ref(dbRealtime, "Tours/" + toursKey + "/Tours/" + tourId), {
            tourSeatsLeft: tourSeatsLeft - numberOfPeople,
            tourTotalFare: tourTotalFare + fare * numberOfPeople,
        });
    };

    const addBookingInfo = async (toursKey, tourId, bookingID, userUID, numberOfPeople) => {
        const bookingData = {
            userUid: userUID,
            bookingDate: moment().format("LLL"),
            numberOfPeople: numberOfPeople,
        };
        await update(ref(dbRealtime, "Tours/" + toursKey + "/Tours/" + tourId + "/Bookings/"), {
            [bookingID]: bookingData,
        });
    };

    const updateUserBookedTours = async (userUID, bookingID, tourId) => {
        const userRef = ref(dbRealtime, "Users/" + userUID + "/bookedTours/");
        const bookingData = {
            tourID: tourId,
            bookingID: bookingID,
            bookingDate: moment().format("LLL"),
        };
        await update(userRef, {
            [bookingID]: bookingData,
        });
    };

    const handleError = (error) => {
        console.error("Error booking tour:", error);
    };

    const bookTour = async (userUID, tourId, numberOfPeople) => {
        try {
            setLoading(true);
            const bookingID = generateRandomID();
            const toursRef = ref(dbRealtime, "Tours");

            const { tourFound, tourSeatsLeft, toursKey, tourFare, tourTotalFare } = await checkTourAvailability(
                toursRef,
                tourId,
            );

            if (!tourFound) {
                showError(
                    "Tour Not Found",
                    "We couldn't find the tour you're looking for. Please browse our other tours to discover your next adventure!",
                );
                return;
            }

            if (tourSeatsLeft <= 0) {
                showError(
                    "Booking Unavailable",
                    "This tour is currently fully booked. Please explore other exciting tours or check back later for availability",
                );
                return;
            }

            if (parseInt(numberOfPeople) > tourSeatsLeft) {
                showError(
                    "Exceeding Seat Capacity",
                    "The number of seats you're trying to book exceeds the available seats for this tour. Please limit the number of people to fit within the available capacity.",
                );
                return;
            }

            await updateTourSeatsAndFare(toursKey, tourId, tourSeatsLeft, tourTotalFare, tourFare, numberOfPeople);
            await addBookingInfo(toursKey, tourId, bookingID, userUID, numberOfPeople);
            await updateUserBookedTours(userUID, bookingID, tourId);

            dispatch(setTour({ isBooked: true }));
            setLoading(false);
            console.log("Booking successful!");
            navigation.navigate("TourBookedScreen", { bookingID: bookingID });
        } catch (error) {
            handleError(error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loaderText}>Booking Tour...</Text>
            </View>
        );
    }

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

    return (
        <BottomSheetView style={styles.container}>
            <View style={styles.InputsContainer}>
                <PlacesAutocomplete
                    placeholder={"Pickup"}
                    onPlaceSelected={(details, data) => {
                        onPlaceSelected(details, data, "origin");
                    }}
                    currentLocation={true}
                    currentLocationLabel={"Current Location"}
                />
                <DestinationPicker />
                <View style={styles.textInputMain}>
                    <TextInput
                        placeholder="Number of People"
                        style={styles.peopleInputMain}
                        value={numberOfPeople.toString()}
                        onChangeText={(text) => {
                            setNumberOfPeople(text);
                        }}
                        keyboardType="number-pad"
                    />
                </View>
                <FareDisplay numberOfPeople={numberOfPeople} />
                <PrimaryButton
                    text="Lets Travel"
                    action={() => bookTour(user.uid, tour.id, parseInt(numberOfPeople))}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    disabled={!(tour.destination && tour.fare)}
                />
            </View>
        </BottomSheetView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "100%",
        width: "100%",
        backgroundColor: "#fff",
        zIndex: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    loaderText: {
        textAlign: "center",
        marginTop: 10,
        fontSize: 16,
        fontFamily: "SatoshiMedium",
        fontWeight: "500",
    },
    container: {
        flex: 1,
        paddingTop: 5,
        paddingHorizontal: 10,
        backgroundColor: "white",
    },
    InputsContainer: {
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 5,
        width: "100%",
    },
    textInputMain: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    peopleInputMain: {
        backgroundColor: "#f2f2f2",
        color: "#000",
        height: 50,
        marginTop: 9,
        borderRadius: 5,
        paddingLeft: 20,
        paddingVertical: 15,
        fontSize: 16,
        fontFamily: "SatoshiMedium",
        fontWeight: "500",
        flex: 1,
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

export default ToursInfoCard;
