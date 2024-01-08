import { StyleSheet, Text, View, Image, Pressable, Linking } from "react-native";

import { SafetyIcon, AmbulanceIcon, PoliceIcon } from "@assets";

const SafetyScreen = () => {
    const callAmbulance = () => {
        Linking.openURL("tel:1122");
    };

    const callPolice = () => {
        Linking.openURL("tel:15");
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.iconContainer}>
                <Image source={SafetyIcon} style={styles.icon} />
            </View>
            <View style={styles.headerContainer}>
                <Text style={styles.heading}>Who do you want to contact?</Text>
            </View>
            <View style={styles.servicesContainer}>
                <Pressable onPress={() => callAmbulance()}>
                    <View style={styles.serviceIconContainer}>
                        <Image source={AmbulanceIcon} style={styles.serviceIcon} />
                    </View>
                    <Text style={styles.serviceNameText}>Ambulance</Text>
                </Pressable>
                <Pressable onPress={() => callPolice()}>
                    <View style={styles.serviceIconContainer}>
                        <Image source={PoliceIcon} style={styles.serviceIcon} />
                    </View>
                    <Text style={styles.serviceNameText}>Police</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    iconContainer: {
        height: 150,
        width: 150,
        alignSelf: "center",
        marginTop: 50,
    },
    icon: {
        height: "100%",
        width: "100%",
        resizeMode: "contain",
    },
    headerContainer: {
        marginVertical: 50,
        paddingHorizontal: 25,
    },
    heading: {
        fontSize: 24,
        fontFamily: "SatoshiBlack",
        fontWeight: "500",
        textAlign: "center",
    },
    servicesContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    serviceIconContainer: {
        height: 90,
        width: 90,
        borderRadius: 50,
        backgroundColor: "#d6fa96",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 3,
    },
    serviceIcon: {
        height: 45,
        width: 45,
        resizeMode: "contain",
    },
    serviceNameText: {
        fontSize: 16,
        fontFamily: "SatoshiBlack",
        fontWeight: "300",
        textAlign: "center",
        marginTop: 10,
    },
});

export default SafetyScreen;
