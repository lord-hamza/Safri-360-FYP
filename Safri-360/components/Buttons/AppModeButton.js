import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";

const AppModeButton = ({ icon, mode, action, selectedMode }) => {
    return (
        <TouchableOpacity
            style={[styles.rideOptionButton, selectedMode && { backgroundColor: "#e3e3e3" }]}
            onPress={action}
        >
            <Text style={styles.text}>{mode}</Text>
            <Image style={styles.icon} source={icon} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    rideOptionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#A7E92F",
        padding: 10,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,
    },
    text: {
        fontSize: 15,
        fontFamily: "SatoshiBlack",
        fontWeight: "600",
    },
    icon: {
        height: 30,
        width: 30,
        marginLeft: 10,
    },
});

export default AppModeButton;
