import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import { useSelector } from "react-redux";

import { selectTour } from "@store/slices/tourSlice";

const TourBookedScreen = ({ route, navigation }) => {
    const { bookingID } = route.params;
    const tour = useSelector(selectTour);

    useEffect(() => {
        if (!tour.isBooked) {
            navigation.navigate("ToursInfoCard");
        }
    }, [tour.isBooked]);

    return (
        <View>
            <View style={styles.container}>
                <LottieView
                    source={require("@assets/animations/check-animation.json")}
                    autoPlay={true}
                    loop={false}
                    style={styles.lottie}
                />
                <Text style={styles.bannerText}>
                    Your Tour ID is <Text style={styles.bookingIDtext}>{bookingID}</Text>. Save the ID for future
                    reference.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingHorizontal: 25,
        paddingBottom: 25,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    lottie: {
        height: 150,
        width: 150,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 20,
        fontFamily: "SatoshiBold",
        fontWeight: "500",
        textAlign: "center",
        marginVertical: 10,
    },
    bannerText: {
        fontSize: 16,
        fontFamily: "SatoshiMedium",
        fontWeight: "500",
        textAlign: "center",
    },
    bookingIDtext: {
        fontSize: 17,
        fontFamily: "SatoshiBold",
        fontWeight: "600",
    },
});

export default TourBookedScreen;
