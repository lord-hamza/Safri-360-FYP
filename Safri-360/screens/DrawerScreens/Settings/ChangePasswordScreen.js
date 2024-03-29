import { useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useFirebase } from "@contexts/FirebaseContext";
import ClearableInput from "@components/ClearableInput";
import PrimaryButton from "@components/Buttons/PrimaryButton";
import { showError } from "@utils/ErrorHandlers";

const ChangePasswordScreen = ({ navigation }) => {
    const { updateUserPassword } = useFirebase();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Change Password",
            headerTitleStyle: {
                fontSize: 21,
                fontFamily: "SatoshiBlack",
                fontWeight: "400",
            },
            headerTitleAlign: "center",
            headerStyle: {
                height: 70,
            },
        });
    }, [navigation]);

    const handleResetPassword = () => {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            showError("All fields are required!", "Please fill all the fields to continue.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            showError("Passwords do not match!", "Please make sure both passwords match.");
            return;
        }
        if (oldPassword && newPassword && confirmNewPassword) {
            const onSuccess = () => {
                console.log("Password updated successfully");
                setTimeout(() => {
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                    navigation.navigate("Home");
                }, 100);
            };
            const onError = (error) => {
                showError("Couldn't update password!", "Please try again later.");
                // console.log("Error updating password: ", error);
                return;
            };
            updateUserPassword(oldPassword, newPassword, onSuccess, onError);
        }
    };

    return (
        <View style={styles.main}>
            <View style={styles.container}>
                <ClearableInput
                    label={"Old Password"}
                    placeholder={"Enter Old Password"}
                    value={newPassword}
                    setValue={setNewPassword}
                    hideInput={true}
                    autoComplete={"password"}
                    textContentType={"password"}
                />

                <ClearableInput
                    label={"New Password"}
                    placeholder={"Enter New Password"}
                    value={newPassword}
                    setValue={setNewPassword}
                    hideInput={true}
                    autoComplete={"password"}
                    textContentType={"password"}
                />

                <ClearableInput
                    label={"Confirm New Password"}
                    placeholder={"Confirm New Password"}
                    value={newPassword}
                    setValue={setNewPassword}
                    hideInput={true}
                    autoComplete={"password"}
                    textContentType={"password"}
                />

                <PrimaryButton
                    text={"Update"}
                    action={() => handleResetPassword()}
                    fontSize={16}
                    disabled={!(oldPassword && newPassword && confirmNewPassword)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 5,
    },
    input: {
        fontSize: 16,
        fontWeight: "400",
        backgroundColor: "#E9E9E9",
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#A7E92F",
        padding: 10,
        borderRadius: 8,
        marginVertical: 10,
    },
    buttonText: {
        color: "#000",
        fontSize: 16,
        marginLeft: 10,
    },
});

export default ChangePasswordScreen;
