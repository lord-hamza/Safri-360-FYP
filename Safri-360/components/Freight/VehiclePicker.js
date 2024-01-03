import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch } from "react-redux";

import { setFreight } from "../../store/slices/freightSlice";

const VehiclePicker = ({ selectedVehicle }) => {
    const dispatch = useDispatch();
    const [selected, setSelected] = useState(selectedVehicle);
    const vehicles = [
        { label: "Loader Rickshaw", value: "loaderRickshaw" },
        { label: "Pickup Van", value: "pickupVan" },
        { label: "Truck", value: "truck" },
    ];

    useEffect(() => {
        setSelected(selectedVehicle);
    }, [selectedVehicle]);

    return (
        <View style={styles.container}>
            <Dropdown
                mode="modal"
                style={styles.dropdown}
                data={vehicles}
                labelField="label"
                valueField="value"
                placeholder="Select vehicle"
                value={selected}
                onChange={(item) => {
                    dispatch(setFreight({ vehicle: item.value }));
                    setSelected(item.value);
                }}
                itemTextStyle={styles.itemTextStyle}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f2f2f2",
        marginVertical: 3,
    },
    dropdown: {
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    itemTextStyle: {
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "SatoshiMedium",
    },
    selectedTextStyle: {
        marginLeft: 15,
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "SatoshiMedium",
    },
    placeholderStyle: {
        color: "#9c9c9c",
        marginLeft: 10,
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "SatoshiMedium",
    },
});

export default VehiclePicker;
