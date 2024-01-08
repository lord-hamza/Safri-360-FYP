import { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "@react-navigation/native";
import { ref, get } from "firebase/database";
import { useDispatch } from "react-redux";

import { dbRealtime } from "../firebase/config";
import { setUser } from "@store/slices/userSlice";
import KeyboardAvoidingWrapper from "@components/KeyboardAvoidingWrapper";
import { useFirebase } from "@contexts/FirebaseContext";
import ClearableInput from "@components/ClearableInput";
import PrimaryButton from "@components/Buttons/PrimaryButton";
import TransparentButton from "@components/Buttons/TransparentButton";
import { showError } from "@utils/ErrorHandlers";

const LoginScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const { signIn, updateUserProfile } = useFirebase();

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            resetInputFields();
        });
        return unsubscribe;
    }, [navigation]);

    const resetInputFields = () => {
        setEmail("");
        setPassword("");
    };

    const handleLogin = () => {
        setLoading(true);
        if (!email) {
            showError("Email is required!", "Please enter your email address.");
            return;
        }
        if (!password) {
            showError("Password is required!", "Please enter your password.");
            return;
        }
        if (email && password) {
            const onSuccess = (credential) => {
                const userRef = ref(dbRealtime, "Users/" + credential.user.uid);
                get(userRef)
                    .then((snapshot) => {
                        const userData = snapshot.val();
                        dispatch(
                            setUser({
                                uid: credential.user.uid,
                                firstName: userData.firstName,
                                lastName: userData.lastName,
                                userName: userData.firstName,
                                email: userData.email,
                                phoneNumber: userData.phoneNumber,
                                phoneNumberVerified: userData.phoneNumber ? true : false,
                                photoURL: userData.photoURL,
                                lastLoginAt: credential.user.metadata.lastSignInTime,
                                isLoggedIn: true,
                            }),
                        );
                        updateUserProfile({
                            displayName: userData.firstName,
                            photoURL: userData.photoURL,
                            phoneNumber: userData.phoneNumber,
                            phoneNumberVerified: userData.phoneNumber ? true : false,
                        });
                        setTimeout(() => {
                            navigation.navigate("HomeScreen");
                        }, 500);
                    })
                    .finally(() => setLoading(false));
            };
            const onError = (error) => {
                if (error.code === "auth/invalid-email") {
                    showError("Invalid Email!", "Please enter a valid email address.");
                } else if (error.code === "auth/wrong-password") {
                    showError("Wrong Password!", "Please enter the correct password.");
                } else if (error.code === "auth/user-not-found") {
                    showError(
                        "User not found!",
                        "Please enter the correct email address or try resetting your password.",
                    );
                } else {
                    showError("Error!", error.message);
                }
            };
            signIn(email, password, onSuccess, onError);
        }
    };

    return (
        <KeyboardAvoidingWrapper>
            <SafeAreaView>
                {loading && (
                    <ActivityIndicator
                        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                        size="large"
                        color="#A7E92F"
                    />
                )}

                <View style={styles.headingContainer}>
                    <Text style={styles.headingText}>Login</Text>
                </View>

                <ClearableInput
                    label={"Email address"}
                    placeholder={"Enter Email Address"}
                    value={email}
                    setValue={setEmail}
                    hideInput={false}
                    autoComplete={"email"}
                    textContentType={"emailAddress"}
                />

                <ClearableInput
                    label={"Password"}
                    placeholder={"Enter Password"}
                    value={password}
                    setValue={setPassword}
                    hideInput={true}
                    autoComplete={"password"}
                    textContentType={"password"}
                />

                <Link to="/PasswordReset" style={styles.linkTextContainer}>
                    <Text style={styles.linkText}>Forgot Password?</Text>
                </Link>
                <PrimaryButton text={"Sign in"} action={() => handleLogin()} disabled={!(email && password)} />
                <TransparentButton text="Create new account" navigation={navigation} navigateTo={"SignUp"} />
            </SafeAreaView>
        </KeyboardAvoidingWrapper>
    );
};

const styles = StyleSheet.create({
    headingContainer: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 10,
        marginVertical: 20,
    },
    headingText: {
        fontSize: 30,
        fontFamily: "SatoshiBlack",
        textAlign: "center",
        fontWeight: "600",
    },
    linkTextContainer: {
        textAlign: "right",
        marginLeft: "auto",
        marginHorizontal: 25,
        marginBottom: 10,
    },
    linkText: {
        fontFamily: "SatoshiMedium",
        fontSize: 14,
        fontWeight: "500",
        color: "#1b2607",
    },
});

export default LoginScreen;
