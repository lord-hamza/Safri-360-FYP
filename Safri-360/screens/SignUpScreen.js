import { DEFAULT_PROFILE_IMAGE } from "@env";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ref, set } from "firebase/database";
import { useDispatch } from "react-redux";

import { setUser, resetUser } from "@store/slices/userSlice";
import { useFirebase } from "@contexts/FirebaseContext";
import { dbRealtime } from "../firebase/config";
import PrimaryButton from "@components/Buttons/PrimaryButton";
import ClearableInput from "@components/ClearableInput";
import KeyboardAvoidingWrapper from "@components/KeyboardAvoidingWrapper";
import TransparentButton from "@components/Buttons/TransparentButton";
import { showError } from "@utils/ErrorHandlers";

const SignUpScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { signUp, updateUserProfile } = useFirebase();

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            dispatch(resetUser());
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            resetInputFields();
        });
        return unsubscribe;
    }, [navigation]);

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    };

    const resetInputFields = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    };

    const AddUserToDB = (user) => {
        const userRef = ref(dbRealtime, "Users/" + user.uid);
        set(userRef, {
            userID: user.uid,
            firstName: firstName,
            lastName: lastName,
            userName: firstName,
            email: email,
            photoURL: DEFAULT_PROFILE_IMAGE,
            phoneNumber: "",
        })
            .then(() => {
                console.log("User added to DB");
            })
            .catch((error) => {
                showError("Something went wrong", "Please try again later.");
                console.log("Error adding user to DB: ", error);
            });
    };

    const handleSignup = () => {
        if (!firstName.trim()) {
            showError("First Name is required", "Please enter your first name.");
            return;
        }

        if (!lastName.trim()) {
            showError("Last Name is required", "Please enter your last name.");
            return;
        }

        if (!validateEmail(email)) {
            showError("Invalid Email", "Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            showError("Password too short", "Password should be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            showError("Passwords do not match", "Please make sure both passwords match.");
            return;
        }

        const onSuccess = (credential) => {
            const user = credential.user;
            AddUserToDB(user);
            navigation.navigate("PhoneRegisterScreen");
        };
        const onError = (error) => {
            if (error.code === "auth/email-already-in-use") {
                showError("Email already in use", "Please use a different email address.");
            } else {
                showError("Something went wrong", "Please try again later.");
                console.log(error);
            }
        };
        dispatch(
            setUser({
                firstName: firstName,
                lastName: lastName,
                userName: firstName,
                email: email,
                photoURL: DEFAULT_PROFILE_IMAGE,
            }),
        );
        updateUserProfile({
            firstName: firstName,
            lastName: lastName,
            displayName: firstName,
            photoURL: DEFAULT_PROFILE_IMAGE,
        });
        signUp(email, password, onSuccess, onError);
    };

    return (
        <KeyboardAvoidingWrapper>
            <SafeAreaView>
                <View style={styles.headingContainer}>
                    <Text style={styles.headingText}>Sign Up</Text>
                </View>

                <ClearableInput
                    label={"First Name"}
                    placeholder={"Enter First Name"}
                    value={firstName}
                    setValue={setFirstName}
                    hideInput={false}
                    autoComplete={"name"}
                    textContentType={"name"}
                />

                <ClearableInput
                    label={"Last Name"}
                    placeholder={"Enter Last Name"}
                    value={lastName}
                    setValue={setLastName}
                    hideInput={false}
                    autoComplete={"name"}
                    textContentType={"name"}
                />

                <ClearableInput
                    label={"Email"}
                    placeholder={"Enter Email"}
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

                <ClearableInput
                    label={"Confirm Password"}
                    placeholder={"Re-enter Password"}
                    value={confirmPassword}
                    setValue={setConfirmPassword}
                    hideInput={true}
                    autoComplete={"password"}
                    textContentType={"password"}
                />

                <PrimaryButton
                    text={"Continue"}
                    action={() => handleSignup()}
                    disabled={!(firstName && email && password && confirmPassword)}
                />
                <TransparentButton text="Already have an account" navigation={navigation} navigateTo={"Login"} />
            </SafeAreaView>
        </KeyboardAvoidingWrapper>
    );
};

const styles = StyleSheet.create({
    headingContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        marginVertical: 20,
    },
    headingText: {
        fontSize: 30,
        fontFamily: "SatoshiBlack",
        textAlign: "center",
        fontWeight: "600",
    },
    LoginOptionContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    LoginOptionText: {
        fontFamily: "Satoshi",
        fontSize: 14,
        color: "#2e2e2d",
    },
    linkText: {
        fontFamily: "SatoshiMedium",
        fontSize: 14,
        fontWeight: "500",
        color: "#1b2607",
    },
});

export default SignUpScreen;
