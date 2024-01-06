import { useLayoutEffect } from "react";
import { StyleSheet, Text, View, Image, Linking } from "react-native";
import { Button } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";

import { LicensePlateIcon } from "../../../../assets";

const FreightHistoryDetailScreen = ({ route, navigation }) => {
    const { data } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Freight Details",
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

    const linkToSupport = () => {
        Linking.openURL("https://safritravels.com/contact/");
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.infoContainer}>
                    <Ionicons name="calendar-outline" size={26} color="#333" />
                    <Text style={styles.infoText}>{data?.createdAt}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Ionicons name="location" size={26} color="#0078d7" />
                    <Text style={styles.infoText}>Origin: {data?.origin.locationName}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Ionicons name="location" size={26} color="green" />
                    <Text style={styles.infoText}>Destination: {data?.destination.locationName}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Ionicons name="cube-outline" size={26} color="#333" />
                    <Text style={styles.infoText}>Type: {data?.vehicle}</Text>
                </View>
                {data.vehicle && (
                    <View style={styles.infoContainer}>
                        <LicensePlateIcon width={26} height={26} />
                        <Text style={styles.infoText}>License Plate: {data?.carRegistraionNumber}</Text>
                    </View>
                )}
                <View style={styles.infoContainer}>
                    <Ionicons name="barbell-outline" size={26} color="#333" />
                    <Text style={styles.infoText}>Weight: {data?.weight} kg</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Ionicons name="cash-outline" size={26} color="#333" />
                    <Text style={styles.infoText}>Fare: PKR {data?.fare}</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    icon={<Ionicons name="chatbubbles-outline" size={22} color={"#000"} />}
                    title="Support"
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                    onPress={linkToSupport}
                />
            </View>
        </View>
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
    infoText: {
        fontSize: 16,
        fontFamily: "SatoshiBold",
        fontWeight: "600",
        marginLeft: 13,
    },
    buttonContainer: {
        marginBottom: 5,
    },
    button: {
        backgroundColor: "#A7E92F",
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 10,
    },
    buttonText: {
        color: "#000",
        fontSize: 16,
        fontFamily: "SatoshiBold",
        fontWeight: "600",
        textAlign: "center",
        marginLeft: 10,
    },
});

export default FreightHistoryDetailScreen;
