import { useLayoutEffect } from "react";
import { StyleSheet, Text, View, Linking } from "react-native";
import { Button } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import KeyboardAvoidingWrapper from "../../../../components/KeyboardAvoidingWrapper";
import { humanPhoneNumber } from "../../../../utils/humanPhoneNumber";

const TourHistoryDetailScreen = ({ route, navigation }) => {
    const { data } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Tour Details",
            headerTitleStyle: {
                fontSize: 20,
                fontFamily: "SatoshiBlack",
                fontWeight: "400",
            },
            headerTitleAlign: "center",
            headerStyle: {
                height: 60,
            },
        });
    }, [navigation]);

    return (
        <KeyboardAvoidingWrapper>
            <>
                <View style={styles.content}>
                    <View style={styles.infoContainer}>
                        <Ionicons name="calendar-outline" size={26} color="#333" />
                        <Text style={styles.tourInfoText}>Booked On: {data.bookingDate}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <MaterialCommunityIcons name="ticket-confirmation-outline" size={27} color="#333" />
                        <Text style={styles.tourInfoText}>Booking ID: {data.bookingID}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Ionicons name="location" size={26} color="#0078d7" />
                        <Text style={styles.tourInfoText}>Pickup: {data?.tourPickup.locationName}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Ionicons name="location" size={26} color="green" />
                        <Text style={styles.tourInfoText}>Destination: {data?.tourDestination.locationName}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Ionicons name="calendar-outline" size={26} color="#333" />
                        <Text style={styles.tourInfoText}>
                            Departure Date & Time: {data?.tourStartDate} {data?.tourDepartureTime}
                        </Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Ionicons name="time-outline" size={26} color="#333" />
                        <Text style={styles.tourInfoText}>
                            Duration: {data?.tourDays} Days, {data?.tourNights} Nights
                        </Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Ionicons name="calendar-outline" size={26} color="#333" />
                        <Text style={styles.tourInfoText}>Return Date: {data?.tourEndDate}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Ionicons name="map-outline" size={26} color="#333" />
                        <View style={styles.itenariesText}>
                            <Text style={styles.tourInfoText}>Itenaries: </Text>
                            <Text style={styles.tourInfoText}>{data?.tourItenary}</Text>
                        </View>
                    </View>
                    <View style={styles.infoContainer}>
                        <Ionicons name="people-outline" size={26} color="#333" />
                        <Text style={styles.tourInfoText}>Person(s): {data?.numberOfPersons}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Ionicons name="cash-outline" size={26} color="#333" />
                        <Text style={styles.tourInfoText}>Fare: PKR {data?.tourFare}/-</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Ionicons name="cash-outline" size={26} color="#333" />
                        <Text style={styles.tourInfoText}>
                            Total Fare: PKR {data?.tourFare * data?.numberOfPersons}
                        </Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Ionicons name="business-outline" size={26} color="#333" />
                        <Text style={styles.tourInfoText}>Tour Company: {data?.companyName}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Ionicons name="call-outline" size={26} color="#333" />
                        <Text style={styles.tourInfoText}>Contact: {humanPhoneNumber(data?.companyPhoneNumber)}</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Contact Tour Company"
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonText}
                        onPress={() => Linking.openURL(`tel:${data?.companyPhoneNumber}`)}
                    />
                </View>
            </>
        </KeyboardAvoidingWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "space-between",
        marginBottom: 10,
        backgroundColor: "#f5f5f5",
    },
    content: {
        flexDirection: "column",
        backgroundColor: "#fff",
        paddingVertical: 20,
        paddingHorizontal: 30,
        margin: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,
    },
    infoContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
    },
    tourInfoText: {
        fontSize: 16,
        fontFamily: "SatoshiBold",
        fontWeight: "600",
        marginLeft: 13,
    },
    itenariesText: {
        flexDirection: "column",
        width: "90%",
    },
    buttonContainer: {
        marginBottom: 5,
    },
    button: {
        backgroundColor: "#A7E92F",
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    buttonText: {
        color: "#000",
        fontSize: 17,
        fontFamily: "SatoshiBold",
        fontWeight: "600",
        textAlign: "center",
        marginLeft: 10,
    },
});

export default TourHistoryDetailScreen;
