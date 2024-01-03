import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";

const ClearableInput = ({
    label,
    placeholder,
    value,
    setValue,
    hideInput,
    KeyboardType,
    autoComplete,
    textContentType,
    editable,
}) => {
    const [focused, setFocus] = useState(false);

    return (
        <Input
            label={label}
            placeholder={placeholder}
            value={value}
            onChangeText={(newText) => {
                setValue(newText);
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            secureTextEntry={hideInput}
            autoComplete={autoComplete}
            textContentType={textContentType}
            keyboardType={KeyboardType ? KeyboardType : "default"}
            editable={editable ? editable : true}
            inputStyle={styles.inputText}
            inputContainerStyle={[styles.inputContainer, focused && styles.focusedInputContainer]}
            containerStyle={styles.containerStyle}
            labelStyle={styles.label}
            rightIcon={
                value.length > 0 ? (
                    <TouchableOpacity onPress={() => setValue("")}>
                        <Ionicons name="close-circle" size={22} color="gray" />
                    </TouchableOpacity>
                ) : null
            }
        />
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        paddingHorizontal: 20,
        marginVertical: -2,
    },
    inputContainer: {
        backgroundColor: "#E9E9E9",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderBottomWidth: 0,
        borderRadius: 10,
    },
    focusedInputContainer: {
        borderWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#A7E92F",
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    inputText: {
        fontSize: 15,
        fontWeight: "400",
        fontFamily: "SatoshiMedium",
    },
    label: {
        fontSize: 15,
        fontWeight: "400",
        fontFamily: "SatoshiMedium",
        color: "#2e2e2d",
        marginBottom: 5,
    },
});

export default ClearableInput;
