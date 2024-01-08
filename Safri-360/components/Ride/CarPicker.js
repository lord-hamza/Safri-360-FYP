import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "react-native-vector-icons/Ionicons";
import { dbRealtime } from "../../firebase/config";
import { ref, onValue, get } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import haversine from "haversine";

import { selectCurrentUserLocation } from "@store/slices/locationSlice";
import { setRide, selectRide } from "@store/slices/rideSlice";

const CarPicker = () => {
    const dispatch = useDispatch();
    const ride = useSelector(selectRide);
    const currentUserLocation = useSelector(selectCurrentUserLocation);

    const [selectedCar, setSelectedCar] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);

    useEffect(() => {
        if (currentUserLocation) {
            getCars(currentUserLocation);
        }
    }, [currentUserLocation]);

    const getCars = (currentLocation) => {
        const SharedRef = ref(dbRealtime, "Shared");
        onValue(SharedRef, (snapshot) => {
            const sharedData = snapshot.val();

            for (const ownerKey in sharedData) {
                const ownerUID = sharedData[ownerKey].userID; // rent a car owner's uid

                const userRef = ref(dbRealtime, "Rent A Car/" + ownerUID);
                const carsRef = ref(dbRealtime, "Rent A Car/" + ownerUID + "/Cars");
                onValue(carsRef, (snapshot) => {
                    const data = snapshot.val();
                    if (!data) return setCars([]);
                    const carsList = [];
                    // rent a car owner's location
                    get(userRef).then((snapshot) => {
                        const userData = snapshot.val();
                        const ownerLocation = {
                            latitude: userData?.location.latitude,
                            longitude: userData?.location.longitude,
                        };
                        // filter cars that are idle and within 2km radius
                        for (let id in data) {
                            if (data[id].status === "Idle" && haversine(currentLocation, ownerLocation) <= 2) {
                                carsList.push({ id, ...data[id] });
                            }
                        }
                        setCars(carsList);
                        setFilteredCars(carsList);
                    });
                });
            }
        });
    };

    const handleCarChange = (item) => {
        dispatch(setRide({ ...ride, car: item }));
        setSelectedCar(item);
        setIsFocus(false);
    };

    const handleSearch = (query) => {
        if (query) {
            const filtered = cars.filter((car) => {
                const carManufacturer = car.manufacturer.toLowerCase().includes(query.toLowerCase());
                const carModel = car.model.toLowerCase().includes(query.toLowerCase());
                const carYear = car.year.toLowerCase().includes(query.toLowerCase());

                return carManufacturer || carModel || carYear;
            });
            setFilteredCars(filtered);
        } else {
            setFilteredCars(cars);
        }
    };

    return (
        <View style={styles.main}>
            <Dropdown
                label="Select Car"
                mode="modal"
                data={filteredCars}
                labelField={"model"}
                valueField={"model"}
                value={selectedCar?.model}
                showsVerticalScrollIndicator={false}
                placeholder="Select a Car"
                maxHeight={400}
                search={true}
                searchField="manufacturer"
                searchPlaceholder="Search Car"
                renderInputSearch={() => (
                    <View style={styles.searchBarContainer}>
                        <Ionicons name="search-outline" size={24} color="gray" style={styles.searchBarIcon} />
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Search Car"
                            placeholderTextColor="gray"
                            onChangeText={handleSearch}
                        />
                    </View>
                )}
                searchQuery={handleSearch}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={handleCarChange}
                renderRightIcon={() => (
                    <Ionicons name="chevron-forward-circle-outline" size={25} color="gray" style={styles.iconStyle} />
                )}
                renderItem={(item, index) => (
                    <View
                        key={index}
                        style={[styles.optionsContainer, isFocus === index && { backgroundColor: "#c8c7cc" }]}
                    >
                        <View style={styles.optionsContainerRow}>
                            <Text style={styles.manufacturerText}>
                                {item?.manufacturer} {item?.model} ({item?.year})
                            </Text>
                            <Text style={styles.registrationNumberText}>
                                {item?.registrationNumber} | {item?.color}
                            </Text>
                        </View>
                    </View>
                )}
                itemContainerStyle={styles.itemContainerStyle}
                containerStyle={styles.container}
                selectedTextStyle={styles.selectedTextStyle}
                placeholderStyle={styles.placeholderStyle}
                inputSearchStyle={styles.inputSearchStyle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        height: 50,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#f2f2f2",
        marginTop: 5,
    },
    container: {
        position: "relative",
        width: "100%",
        height: 500,
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    optionsContainerRow: {
        flexDirection: "column",
        alignItems: "flex-start",
    },
    manufacturerText: {
        fontSize: 17,
        fontWeight: "600",
        fontFamily: "SatoshiBold",
        color: "#000",
    },
    registrationNumberText: {
        fontSize: 16,
        fontWeight: "500",
        fontFamily: "SatoshiMedium",
        color: "#000",
        marginTop: 2,
    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        marginTop: 10,
    },
    searchBar: {
        flex: 1,
        fontSize: 16,
        fontFamily: "SatoshiMedium",
        fontWeight: "600",
        paddingHorizontal: 10,
    },
    searchBarIcon: {
        marginLeft: 5,
    },
    iconStyle: {
        position: "absolute",
        right: 10,
    },
    optionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
    },
    itemContainerStyle: {
        backgroundColor: "#fff",
        paddingHorizontal: 5,
        borderBottomWidth: 0.5,
        borderColor: "#ccc",
    },
    selectedTextStyle: {
        marginLeft: 15,
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "SatoshiMedium",
    },
    placeholderStyle: {
        color: "#9c9c9c",
        marginLeft: 15,
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "SatoshiMedium",
    },
    inputSearchStyle: {
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "SatoshiMedium",
        paddingHorizontal: 10,
        flex: 1,
    },
});

export default CarPicker;
