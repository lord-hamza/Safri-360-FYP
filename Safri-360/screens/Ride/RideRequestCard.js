import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Linking } from "react-native";
import { Divider } from "react-native-elements";
import { Skeleton } from "@rneui/themed";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { ref, onValue, update } from "firebase/database";
import { useSelector, useDispatch } from "react-redux";
import { AirbnbRating } from "react-native-ratings";
import Modal from "react-native-modal";

import { humanPhoneNumber } from "../../utils/humanPhoneNumber";
import { selectRide, setRide } from "../../store/slices/rideSlice";
import { selectUser } from "../../store/slices/userSlice";
import { dbRealtime } from "../../firebase/config";
import { useMapContext } from "../../contexts/MapContext";
import DisplayStarRatings from "../../components/Ride/DisplayStarRatings";

const RideRequestCard = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [assignedDriver, setAssignedDriver] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [rating, setRating] = useState(0);

    const { showDirection } = useMapContext();
    const user = useSelector(selectUser);
    const ride = useSelector(selectRide);
    const dispatch = useDispatch();

    useEffect(() => {
        const rideRef = ref(dbRealtime, "Rides/" + ride.rideID);
        onValue(rideRef, (snapshot) => {
            const rideData = snapshot.val();
            if (rideData) {
                if (rideData.customerID === user.uid && rideData.status === "assigned") {
                    const driverRef = ref(dbRealtime, "Drivers/" + ride.assignedDriverPIN);
                    dispatch(setRide({ ...ride, status: "assigned" }));
                    onValue(driverRef, (snapshot) => {
                        const driverData = snapshot.val();
                        if (driverData) {
                            setAssignedDriver(driverData);
                            setLoading(false);
                        }
                    });
                } else if (rideData.customerID === user.uid && rideData.status === "ongoing") {
                    dispatch(setRide({ ...ride, status: "ongoing" }));
                } else if (rideData.customerID === user.uid && rideData.status === "completed") {
                    dispatch(setRide({ ...ride, status: "completed" }));
                } else if (rideData.customerID === user.uid && rideData.status === "cancelled") {
                    dispatch(setRide({ ...ride, status: "cancelled" }));
                }
            }
        });
    }, []);

    const calculateNewRating = (currentRating, totalRatings, newRating) => {
        if (totalRatings === 0) {
            return newRating;
        }
        return (currentRating + newRating) / (totalRatings + 1);
    };

    const submitRating = () => {
        const driverRef = ref(dbRealtime, "Drivers/" + ride.assignedDriverPIN);
        const newRating = calculateNewRating(
            assignedDriver.ratings.rating,
            assignedDriver.ratings.totalRatings,
            rating,
        );
        update(driverRef, {
            ratings: {
                rating: newRating,
                totalRatings: assignedDriver.ratings.totalRatings + 1,
            },
        })
            .then(() => {
                navigation.navigate("Home");
                setModalVisible(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const callUser = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    return (
        <BottomSheetView style={styles.mainContainer}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Skeleton animation="pulse" width="100%" height="50" skeletonStyle={styles.skeletonStyle} />
                </View>
            ) : (ride.status === "assigned" || ride.status === "ongoing") && showDirection && !loading ? (
                // Driver Details here:
                <View style={styles.container}>
                    <Divider style={{ width: "100%", marginTop: -13, marginBottom: 10 }} />
                    <Text style={styles.driverHeader}>Details</Text>
                    <View style={styles.driverInfoContainer}>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={styles.primaryText}>{assignedDriver.firstName}</Text>
                            <DisplayStarRatings
                                rating={assignedDriver.ratings.rating}
                                totalRatings={assignedDriver.ratings.totalRatings}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.iconContainer}
                            onPress={() => callUser(humanPhoneNumber(assignedDriver.phoneNumber))}
                        >
                            <Ionicons name="call-outline" size={24} color="#000" style={{ padding: 12 }} />
                        </TouchableOpacity>
                    </View>

                    <Divider style={{ width: "100%", marginVertical: 10 }} />
                    <View style={styles.infoContainer}>
                        <Ionicons name="location-outline" size={27} color="#007ACC" style={styles.icon} />
                        <Text style={styles.infoText}>{ride.origin.locationName}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Ionicons name="location-outline" size={27} color="red" style={styles.icon} />
                        <Text style={styles.infoText}>{ride.destination.locationName}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Ionicons name="cash-outline" size={27} color="#333" style={styles.icon} />
                        <Text style={styles.infoText}>PKR {ride.fare}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Ionicons name="car-outline" size={27} color="#333" style={styles.icon} />
                        <Text style={styles.infoText}>
                            {ride.selectedCar.manufacturer +
                                " - " +
                                ride.selectedCar.model +
                                " - " +
                                ride.selectedCar.year}
                        </Text>
                    </View>
                </View>
            ) : ride.status === "completed" && !loading ? (
                <></>
            ) : (
                ride.status === "cancelled" && <></>
            )}
            <Modal isVisible={ride.status === "completed"}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalHeader}>Ride Completed!</Text>
                    <Text style={styles.modalText}>Please rate your driver</Text>
                    <View style={styles.ratingContainer}>
                        <AirbnbRating
                            size={30}
                            count={5}
                            reviews={["Terrible", "Bad", "Okay", "Good", "Great"]}
                            defaultRating={0}
                            onFinishRating={(rating) => setRating(rating)}
                        />
                    </View>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity style={styles.modalButton} onPress={submitRating}>
                            <Text style={styles.modalButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </BottomSheetView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginHorizontal: 10,
        backgroundColor: "#fff",
    },
    container: {
        padding: 20,
    },
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    skeletonStyle: {
        height: 70,
    },
    container: {
        padding: 20,
    },
    driverHeader: {
        fontSize: 20,
        fontFamily: "SatoshiBlack",
        fontWeight: "600",
        color: "#000",
        textAlign: "left",
        marginBottom: 10,
    },
    driverInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    primaryText: {
        fontSize: 20,
        fontFamily: "SatoshiBold",
        fontWeight: "600",
        color: "#000",
        textAlign: "left",
    },
    iconContainer: {
        borderRadius: 50,
        backgroundColor: "#A7E92F",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        padding: 3,
    },
    infoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    infoText: {
        width: "90%",
        fontSize: 16,
        fontFamily: "SatoshiBold",
        fontWeight: "500",
        color: "#000",
        textAlign: "left",
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 30,
        borderRadius: 10,
    },
    modalHeader: {
        color: "#000",
        fontSize: 20,
        fontWeight: "600",
        fontFamily: "SatoshiBold",
        textAlign: "center",
    },
    modalText: {
        color: "#666",
        fontSize: 16,
        fontWeight: "500",
        fontFamily: "SatoshiMedium",
        textAlign: "center",
        marginTop: 10,
    },
    ratingContainer: {
        marginTop: 20,
    },
    modalButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    modalButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: "#A7E92F",
    },
    modalButtonText: {
        color: "#000",
        fontSize: 15,
        fontWeight: "500",
        fontFamily: "SatoshiMedium",
        textAlign: "center",
    },
});

export default RideRequestCard;
